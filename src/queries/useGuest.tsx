import guestApiRequest from "@/apiRequests/guest";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { GuestUpdateOrdersBodyType } from "@/schemaValidations/guest.schema";
export const useGuestLoginMutation = () => {
  return useMutation({
    mutationFn: guestApiRequest.login,
  });
};

export const useGuestLogoutMutation = () => {
  return useMutation({
    mutationFn: guestApiRequest.logout,
  });
};

export const useGuestOrderMutation = () => {
  return useMutation({
    mutationFn: guestApiRequest.order,
  });
};

// export const useGuestUpdateMutation = () => {
//   return useMutation({
//     mutationFn: guestApiRequest.update,
//   });
// };
export const useGuestUpdateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...body }: { id: number } & GuestUpdateOrdersBodyType) =>
      guestApiRequest.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["guest-orders"], // thay bằng queryKey phù hợp bạn đang cache
        exact: true,
      });
    },
  });
};
export const useGuestGetOrderListQuery = () => {
  return useQuery({
    queryFn: guestApiRequest.getOrderList,
    queryKey: ["guest-orders"],
  });
};

export const useGetGuestQuery = ({
  id,
  enabled,
}: {
  id: string;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["guestes", id],
    queryFn: () => guestApiRequest.getGuest(id),
    enabled,
  });
};
