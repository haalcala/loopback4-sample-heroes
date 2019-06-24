import crypto = require("crypto");

class MyUtil {
	async getEmailToken(email: string): Promise<string> {
		return this.getSha256(email);
	}

	getSha256(string: string, key?: string): string {
		if (key) {
			return crypto
				.createHmac("sha256", key)
				.update(string)
				.digest("hex");
		}

		return crypto
			.createHash("sha256")
			.update(string)
			.digest("hex");
	}
}

export const myUtil = new MyUtil();
