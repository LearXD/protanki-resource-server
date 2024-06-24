

export class ByteArray {

    public constructor(
        private buffer?: Buffer
    ) {
        // clone buffer
        this.buffer = Buffer.from(buffer || [])
    }

    public writeInt(value: number) {
        const buffer = Buffer.alloc(4);
        buffer.writeInt32BE(value);
        this.buffer = Buffer.concat([this.buffer, buffer]);

        return this;
    }

    public readInt() {
        const value = this.buffer.subarray(0, 4).readInt32BE();
        this.buffer = this.buffer.subarray(4);
        return value;
    }

    public writeUnsignedInt(value: number) {
        const buffer = Buffer.alloc(4);
        buffer.writeUInt32BE(value);
        this.buffer = Buffer.concat([this.buffer, buffer]);

        return this;
    }

    public readUnsignedInt() {
        const value = this.buffer.subarray(0, 4).readUInt32BE();
        this.buffer = this.buffer.subarray(4);
        return value;
    }

    public writeUnsignedShort(value: number) {
        const buffer = Buffer.alloc(2);
        buffer.writeUInt16BE(value);
        this.buffer = Buffer.concat([this.buffer, buffer]);

        return this;
    }

    public readUnsignedShort() {
        const value = this.buffer.subarray(0, 2).readUInt16BE();
        this.buffer = this.buffer.subarray(2);
        return value;
    }

    public writeUnsignedByte(value: number) {
        const buffer = Buffer.alloc(1);
        buffer.writeUInt8(value);
        this.buffer = Buffer.concat([this.buffer, buffer]);

        return this;
    }

    public readUnsignedByte() {
        const value = this.buffer.subarray(0, 1).readUInt8();
        this.buffer = this.buffer.subarray(1);
        return value;
    }

}