"use client";

import { useState } from "react";

import { api } from "@/trpc/react";

export function GetGroupById() {
  const [id, setId] = useState("1");

  const createPost = api.group.getGroup.useQuery({ id: parseInt(id) });

  return (
    <>
      {createPost.data && (
        <div>
          <p>
            Group {createPost.data.id}: {createPost.data.name}
          </p>
          <p>Created By: {createPost.data.createdById}</p>
        </div>
      )}
    </>
  );
}
