import React, { useState, useEffect } from "react";
import PopupLayout from "../PopupLayout";
import TagTable from "../table/TagTable";
import CloseIcon from "../icons/close.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";

const TagCard = ({ tag, tagClose }) => {
  const [tagData, setTagData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (tag) {
      // console.log("tag dfghj", tag);
      fetch(`/api/expense/search/${tag}?limit=5`)
        .then((res) => res.json())
        .then((res) => {
          setTagData(res);
        })
        .catch((err) => console.log(err));
    }
  }, [tag]);

  return (
    <>
      {tagData && tagData.expense ? (
        <PopupLayout>
          <div className="overflow-hidden p-6">
            <div
              className="flex justify-end cursor-pointer"
              onClick={() => tagClose()}
            >
              <Image src={CloseIcon} alt="close" width={"16"} />
            </div>
            <div className="flex justify-between mt-1">
              <h2 className="mb-2">
                Tag: <b>{tag}</b>
              </h2>
              <p>
                Total: <b>{tagData.total}</b>
              </p>
            </div>
            <TagTable tagData={tagData?.expense} />
            <div className="flex justify-end">
              <p
                className="cursor-pointer"
                onClick={() => router.push(`/tag?tag=${tag}`)}
              >
                ...more
              </p>
            </div>
          </div>
        </PopupLayout>
      ) : (
        ""
      )}
    </>
  );
};

export default TagCard;
