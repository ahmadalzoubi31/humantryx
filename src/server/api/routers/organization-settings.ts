import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { accessControl } from "../middleware/casl-middleware";
import { OrganizationSettingsService } from "../services/organization-settings.service";
import { organizationSettingsSchema } from "@/modules/settings/schemas/organization-settings.schema";

export const organizationSettingsRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const organizationId = ctx.session.session.activeOrganizationId;
    if (!organizationId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No active organization found",
      });
    }

    return OrganizationSettingsService.get(organizationId);
  }),

  update: protectedProcedure
    .input(organizationSettingsSchema)
    .use(
      accessControl(async (_option, ability) => {
        return ability.can("manage", "OrganizationSettings");
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const organizationId = ctx.session.session.activeOrganizationId;
      if (!organizationId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No active organization found",
        });
      }

      return OrganizationSettingsService.update({
        organizationId,
        data: input,
      });
    }),
});
