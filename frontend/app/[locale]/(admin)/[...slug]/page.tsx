import React, {use} from "react";

export default function SinglePage({params}:{params:Promise<{slug:string[]}>}) {
    const {slug} = use(params);
    return(
      <>
        <h1 className="text-xl font-bold text-admin-title capitalize">
          {slug[0]}
        </h1>

        <p className={"mt-4"}>
          {slug[1]}
        </p>
      </>
    )
}
