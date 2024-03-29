"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCardModal } from "@/hooks/use-card-modal";
import { fetcher } from "@/lib/fetcher";
import { CardWithList } from "@/lib/types";
import { TaskApp_AuditLog } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Actions } from "./actions";
import { Activity } from "./activity";
import { Description } from "./description";
import { Header } from "./header";

export const CardModal = () => {
  const id = useCardModal((state) => state.id);
  const isOpen = useCardModal((state) => state.isOpen);
  const onClose = useCardModal((state) => state.onClose);

  const {
    data: cardData,
    isPending,
    error,
  } = useQuery<CardWithList>({
    queryKey: ["card", id],
    queryFn: () => fetcher(`/api/cards/${id}`),
    enabled: !!id,
  });

  const {
    data: auditLogsData,
    isError,
    isPending: isAuditLogsPending,
    error: auditLogsError,
    refetch: refetchAuditLogs,
  } = useQuery<TaskApp_AuditLog[]>({
    queryKey: ["card-logs", id],
    queryFn: () => fetcher(`/api/cards/${id}/logs`),
    enabled: !!id,
  });

  if (isError) {
    return <div>error loading the data</div>;
  }
  if (!cardData) {
    return <div>NO data found </div>;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        {error ? (
          <div className="flex flex-col gap-2 ">
            <span>Something went wrong. </span>
            <span>{error.message}</span>
          </div>
        ) : (
          <>
            {" "}
            {isPending ? <Header.Skeleton /> : <Header data={cardData} />}
            <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
              <div className="col-span-3">
                <div className="w-full space-y-6">
                  {isPending ? (
                    <Description.Skeleton />
                  ) : (
                    <Description data={cardData} />
                  )}
                  {!auditLogsData ? (
                    <Activity.Skeleton />
                  ) : (
                    <Activity items={auditLogsData} />
                  )}
                </div>
              </div>
              {isPending ? <Actions.Skeleton /> : <Actions data={cardData} />}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
