import { type StaffResponse, Collections, type WorkResponse } from "@/types/pb";

export const getWorks = async (title: string) => {
  const { $pb } = useNuxtApp();
  const data = await $pb.collection(Collections.Work).getFullList<
    WorkResponse<{
      staff: StaffResponse;
    }>
  >({
    filter: `title = '${title}'`,
    sort: "+created",
    expand: "staff",
  });

  return structuredClone(data);
};
