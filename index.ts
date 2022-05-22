import axios from "axios";
import Poller from "./poller";

const START_DATE = new Date().toDateString();
const END_DATE = new Date("5/26/2022").toDateString();

const today = new Date();

class Main<T> {
	private poller: Poller<T>;
	private startDate: string;
	private endDate: string;
	private API_ROUTE =
		"https://disneyland.disney.go.com/passes/blockout-dates/api/get-availability/?product-types=enchant-key-pass&destinationId=DLR&numMonths=12";

	constructor(startDate?: string, endDate?: string) {
		this.startDate = startDate ?? new Date().toString();
		this.endDate =
			endDate ?? new Date(today.setDate(today.getDate() + 5)).toString(); // defaults to 5 days from today
		this.poller = new Poller<T>(
			this.API_ROUTE,
			this.getHasAvailabilities.bind(this), // checkForTargetData
			this.genHandleAvailabilities.bind(this), // callback
		);
		this.init();
	}

	private async init() {
		await this.poller.genPoll();
	}

	private async genAvailableDates(data) {
		const availabilities = data["calendar-availabilities"];
		const filteredDates = availabilities.filter((day) => {
			const { date } = day;
			const calendarDate = new Date(replaceHyphensWithDash(date));
			return (
				calendarDate >= new Date(this.startDate) &&
				calendarDate <= new Date(this.endDate)
			);
		});

		return filteredDates
			.filter((day) => {
				const { facilities } = day;
				return facilities.some((fac) => {
					return fac.available;
				});
			})
			.map(({ date }) => date);
	}

	private async genHandleAvailabilities(data) {
		const availableDates = await this.genAvailableDates(data);
		console.log(`
      There are available dates: ${availableDates}
      Link: https://disneyland.disney.go.com/entry-reservation/add/select-date/
    `);
		console.log({ availableDates });
	}

	private getHasAvailabilities(data): boolean {
		const availabilities = data["calendar-availabilities"];
		const filteredDates = availabilities.filter((day) => {
			const { date } = day;
			const calendarDate = new Date(replaceHyphensWithDash(date));
			return (
				calendarDate > new Date(this.startDate) &&
				calendarDate <= new Date(this.endDate)
			);
		});

		return filteredDates.some((day) => {
			const { facilities } = day;
			return facilities.some((fac) => {
				return fac.available;
			});
		});
	}
}

async function genCalendarAvailabilities() {
	const { data } = await axios.get(
		"https://disneyland.disney.go.com/passes/blockout-dates/api/get-availability/?product-types=enchant-key-pass&destinationId=DLR&numMonths=12",
	);
	return data;
}

new Main<any>(START_DATE, END_DATE);
// new Main<any>("6/1/2022", "6/12/2022");

// async function genCalendarAvailabilities() {
// 	const resp = await fetch(
// 		"https://disneyland.disney.go.com/passes/blockout-dates/api/get-availability/?product-types=enchant-key-pass&destinationId=DLR&numMonths=12",
// 		{
// 			headers: {
// 				"Content-Type": "application/json",
// 			},
// 		},
// 	);
// 	const final = await resp.json();
// 	return final;
// }

function replaceHyphensWithDash(date) {
	return date.replace(/-/gim, "/");
}

async function findAvailabilitiesImpl(availabilities) {
	const out = availabilities.filter((date) => {
		const { facilities } = date;
		return facilities.some((facility) => facility.available);
	});
	return out.map((val) => val.date);
}

async function findAvailabilitiesWithinDates(date1, date2) {
	const availabilities = await genCalendarAvailabilities();
	const calendarAvailabilities = availabilities["calendar-availabilities"];
	const startDate = new Date(replaceHyphensWithDash(date1));
	const endDate = new Date(replaceHyphensWithDash(date2));

	const filteredDates = calendarAvailabilities.filter(({ date: _date }) => {
		const date = new Date(replaceHyphensWithDash(_date));

		return date >= startDate && date <= endDate;
	});

	return await findAvailabilitiesImpl(filteredDates);
}

async function findAvailabilities() {
	const dates = await genCalendarAvailabilities();
	const calendarAvailabilities = dates["calendar-availabilities"];
	const out = await findAvailabilitiesImpl(calendarAvailabilities);
	console.log(out);
	return out;
}

function hasTarget(dates, targetDate) {
	return dates.find((date) => {
		return (
			new Date(replaceHyphensWithDash(date)).toString() ==
			new Date(replaceHyphensWithDash(targetDate)).toString()
		);
	});
}

const MAX_PROCESS = 10000;
async function process(targetDate) {
	let processIdx = 0;
	const interval = setInterval(async () => {
		if (processIdx === MAX_PROCESS) {
			clearInterval(interval);
			console.log("max process reached");
		}
		const resp = await findAvailabilities();
		if (hasTarget(resp, targetDate)) {
			console.log(`${targetDate} has availabilities`);
			clearInterval(interval);
		}
		processIdx++;
	}, 2000);
}
// process("2022-05-13");
// findAvailabilitiesWithinDates(START_DATE, END_DATE).then((resp) => {
// 	if (resp.length) {
// 		console.log(`availabilities between ${START_DATE} and ${END_DATE}`);
// 		console.log(resp);
// 		return;
// 	}
// 	console.log(
// 		`There are no availabilities between ${START_DATE} and ${END_DATE}`,
// 	);
// });
