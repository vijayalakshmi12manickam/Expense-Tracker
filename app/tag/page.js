"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import TagTable from "../components/table/TagTable";

const Search = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get("tag");

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
      {tagData && tagData?.expense?.length >= 1 ? (
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

const Tag = () => {
  return (
    <Suspense fallback={<div>Loading tag data...</div>}>
      <Search />
    </Suspense>
  );
};

export default Tag;
