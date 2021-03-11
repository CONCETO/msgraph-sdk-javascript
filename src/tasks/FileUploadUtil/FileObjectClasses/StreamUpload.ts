import { Readable } from "stream";

import { GraphClientError } from "../../../GraphClientError";
import { Range } from "../../../Range";
import { FileObject } from "../../LargeFileUploadTask";
export class StreamUpload implements FileObject {
	content: Readable;
	name: string;
	size: number;
	public constructor(content: Readable, name: string, size: number) {
		if (!content || !name || !size) {
			throw new GraphClientError("Please provide the Readable Stream content, name of the file and size of the file");
		}
		this.content = content;
		this.size = size;
		this.name = name;
	}

	/**
	 * @public
	 * Slices the file content to the given range
	 * @param {Range} range - The range value
	 * @returns The sliced file part
	 */
	public async sliceFile(range: Range): Promise<ArrayBuffer | Blob | Buffer> {
		const rangeSize = range.maxValue - range.minValue + 1;
		/* readable.readable Is true if it is safe to call readable.read(),
		 * which means the stream has not been destroyed or emitted 'error' or 'end'
		 */
		if (this.content.readable) {
			if (this.content.readableLength >= rangeSize) {
				return this.content.read(rangeSize);
			} else {
				return await this.readNBytesFromStream(rangeSize);
			}
		} else {
			throw new GraphClientError("Stream is not readable.");
		}
	}

	/**
	 * @private
	 * Reads the specified byte size from the stream
	 * @param {number} size - The size of bytes to be read
	 * @returns Buffer with the given length of data.
	 */

	private readNBytesFromStream(size: number): Promise<Buffer> {
		return new Promise((resolve, reject) => {
			const chunks = [];
			let remainder = size;
			let length = 0;
			this.content.on("end", () => {
				if (remainder > 0) {
					return reject(new GraphClientError("Stream ended before reading required range size"));
				}
			});
			this.content.on("readable", () => {
				/**
				 * (chunk = this.content.read(size)) can return null if size of stream is less than 'size' parameter.
				 * Read the remainder number of bytes from the stream iteratively as they are available.
				 */
				let chunk;
				console.log("within readable");
				while (length < size && (chunk = this.content.read(remainder)) !== null) {
					length += chunk.length;
					chunks.push(chunk);
					if (remainder > 0) {
						remainder = size - length;
					}
				}

				if (length === size) {
					return resolve(Buffer.concat(chunks));
				}

				if (!this.content.readable) {
					return reject(new GraphClientError("Error encountered while reading the stream during the upload"));
				}
			});
		});
	}
}
