import axios from "axios";

type Callback<T> = (resp: T) => any | Promise<any>;

export default class Poller<T> {
	private api: string;
	private intervalId: NodeJS.Timer | null = null;
	private intervalIdx: number = 0;
	public isInFlight = false;
	private checkForTargetData: (...args: any) => boolean | Promise<boolean>;
	private callback: Callback<T>;

	private MAX_INTERVAL = 1000;

	constructor(
		api: string,
		checkForTargetData: (...args: any) => boolean | Promise<boolean>,
		// Callback must return a boolean
		// This boolean will let us know if the poller needs to continue or not
		callback: Callback<T>,
	) {
		this.api = api;
		this.checkForTargetData = checkForTargetData;
		this.callback = callback;
	}

	private async genGetApi() {
		const out = await axios.get<T>(this.api);
		return out;
	}

	public async genPoll(intervalMs: number = 2000) {
		this.intervalId = setInterval(async () => {
			if (this.intervalIdx == this.MAX_INTERVAL) {
				console.log("Maximum check exceeded");
				this.stopPoll();
			}
			if (!this.isInFlight) {
				this.intervalIdx++;
				this.isInFlight = true;
				const { data } = await this.genGetApi();
				const hasTargetData = await Promise.resolve(
					this.checkForTargetData(data),
				);
				if (hasTargetData) {
					this.stopPoll();
					this.callback(data);
				}
				this.isInFlight = false;
			}
		}, intervalMs);
	}

	public stopPoll() {
		if (this.intervalId !== null) {
			clearInterval(this.intervalId);
		}
	}
}
