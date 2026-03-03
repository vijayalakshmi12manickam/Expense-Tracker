"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import TagTable from "../components/table/TagTable";

const Tag = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get("tag");
  console.log("ro", search);

  const [tagData, setTagData] = useState([]);

  useEffect(() => {
    if (search) {
      fetch(`/api/expense/search/${search}`)
        .then((res) => res.json())
        .then((res) => {
          setTagData(res);
        })
        .catch((err) => console.log(err));
    }
  }, [search]);

  return (
    <>
      {tagData && tagData?.expense?.length > 1 ? (
        <div className="ml-8 mt-4">
          <div className="flex justify-between mb-3">
            <h3>
              <b>{search}</b>
            </h3>
            <h6>
              Total: <b>{tagData.total}</b>
            </h6>
          </div>
          <TagTable tagData={tagData?.expense} />
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default Tag;
