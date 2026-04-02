"use client";

import React, { useState } from "react";
import { Upload, Link as LinkIcon, MapPin, FileText, Building2 } from "lucide-react";

export default function Page() {
  const [logo, setLogo] = useState<File | null>(null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-xl rounded-2xl bg-card p-8 shadow-xl border border-border">

        {/* Logo Upload */}
        <div className="mb-6">
          <label className="text-sm text-muted-foreground mb-2 block">
            Organization Logo
          </label>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl h-32 cursor-pointer hover:border-muted-foreground transition">
            <Upload className="text-muted-foreground mb-2" />
            <span className="text-muted-foreground text-sm">Click to upload</span>
            <input
              type="file"
              className="hidden"
              onChange={(e) => setLogo(e.target.files?.[0] || null)}
            />
          </label>
        </div>

        {/* Organization Name */}
        <div className="mb-5">
          <label className="text-sm text-muted-foreground mb-2 block">
            Organization Name
          </label>
          <div className="flex items-center bg-muted rounded-xl px-3 py-3">
            <Building2 className="text-muted-foreground mr-2" size={18} />
            <input
              placeholder="e.g. SoundWave Productions"
              className="bg-transparent outline-none text-foreground placeholder:text-muted-foreground w-full"
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-5">
          <label className="text-sm text-muted-foreground mb-2 block">
            Description
          </label>
          <div className="flex bg-muted rounded-xl px-3 py-3">
            <FileText className="text-muted-foreground mr-2 mt-1" size={18} />
            <textarea
              placeholder="Tell people about your organization..."
              className="bg-transparent outline-none text-foreground placeholder:text-muted-foreground w-full resize-none h-24"
            />
          </div>
        </div>

        {/* Location */}
        <div className="mb-5">
          <label className="text-sm text-muted-foreground mb-2 block">
            Location (optional)
          </label>
          <div className="flex items-center bg-muted rounded-xl px-3 py-3">
            <MapPin className="text-muted-foreground mr-2" size={18} />
            <input
              placeholder="City, State"
              className="bg-transparent outline-none text-foreground placeholder:text-muted-foreground w-full"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="mb-6">
          <label className="text-sm text-muted-foreground mb-2 block">
            Social Links
          </label>
          <div className="flex items-center bg-muted rounded-xl px-3 py-3 mb-3">
            <LinkIcon className="text-muted-foreground mr-2" size={18} />
            <input
              placeholder="Website URL"
              className="bg-transparent outline-none text-foreground placeholder:text-muted-foreground w-full"
            />
          </div>
          <div className="flex items-center bg-muted rounded-xl px-3 py-3">
            <LinkIcon className="text-muted-foreground mr-2" size={18} />
            <input
              placeholder="Instagram, Twitter, etc."
              className="bg-transparent outline-none text-foreground placeholder:text-muted-foreground w-full"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button className="w-full py-3 rounded-xl font-semibold text-primary-foreground bg-primary hover:opacity-90 transition">
          Create Organization
        </button>
      </div>
    </div>
  );
}