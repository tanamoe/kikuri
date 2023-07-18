import { Record } from "pocketbase";

export interface DateRecord extends Partial<Record> {
  date: string;
}

interface Group {
  [k: string]: any;
}

export interface GroupArray {
  date: Date;
  publications: {
    [k: string]: any;
  }[];
}

export const groupByDate = (data: DateRecord[]) => {
  // this gives an object with dates as keys
  const groups: Group = data.reduce((groups, entry) => {
    const date = entry.date.split("T")[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(entry);
    return groups;
  }, {} as Group);

  // Edit: to add it in the array format instead
  const groupArrays: GroupArray[] = Object.keys(groups).map((date) => {
    return {
      date: new Date(date),
      publications: groups[date],
    };
  });

  return groupArrays;
};
