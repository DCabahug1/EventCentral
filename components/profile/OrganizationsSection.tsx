"use client";

import { Building2, Plus } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import PaginationBar from "@/components/discover/PaginationBar";
import type { Organization } from "@/lib/types";
import EmptyState from "@/components/profile/EmptyState";
import OrgCard from "@/components/profile/OrgCard";

type Props = {
  organizations: Organization[];
  paginatedOrganizations: Organization[];
  organizationsPage: number;
  totalOrganizationPages: number;
  organizationsPageSize: number;
  onPageChange: (page: number) => void;
  onCreateOrganization: () => void;
};

export default function OrganizationsSection({
  organizations,
  paginatedOrganizations,
  organizationsPage,
  totalOrganizationPages,
  organizationsPageSize,
  onPageChange,
  onCreateOrganization,
}: Props) {
  return (
    <motion.section
      className="flex flex-col gap-4"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="h-5 w-1 shrink-0 bg-primary" />
            <h2 className="text-2xl font-bold">Organizations</h2>
          </div>
          <p className="pl-3 text-sm text-muted-foreground">
            Manage your organizations.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCreateOrganization}
        >
          <Plus className="size-4" />
          New Organization
        </Button>
      </div>

      {organizations.length === 0 ? (
        <EmptyState
          message="Create an organization to host events and build a community."
          action={
            <Button type="button" size="sm" onClick={onCreateOrganization}>
              <Building2 className="size-4" />
              Create Organization
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {paginatedOrganizations.map((org, index) => (
              <motion.div
                key={org.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, ease: "easeOut", delay: index * 0.04 }}
              >
                <OrgCard org={org} />
              </motion.div>
            ))}
          </div>
          <PaginationBar
            label="Organizations"
            page={organizationsPage}
            totalPages={totalOrganizationPages}
            totalItems={organizations.length}
            pageSize={organizationsPageSize}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </motion.section>
  );
}
