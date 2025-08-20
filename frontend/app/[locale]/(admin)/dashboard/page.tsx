import React from 'react';
import Button from "@/component/util/base/Button";
import BasicCard from "@/component/util/base/BasicCard";

export default function DashboardPage() {
  return (
    <BasicCard>
      {/*Title*/}
      <BasicCard.title>
        <h1 className="text-xl font-bold text-primary capitalize">
          tes
        </h1>
      </BasicCard.title>

      {/*content*/}
      <BasicCard.content>
        <div className={"flex gap-4"}>
          <Button buttonName={"default"} buttonType={"button"} variant={"default"} buttonText={"Default"} size={"md"}/>
          <Button buttonName={"white"} buttonType={"button"} variant={"white"} buttonText={"White"} size={"md"}/>
          <Button buttonName={"primary"} buttonType={"button"} variant={"primary"} buttonText={"Primary"} size={"md"}/>
          <Button buttonName={"secondary"} buttonType={"button"} variant={"secondary"} buttonText={"Secondary"} size={"md"}/>
          <Button buttonName={"success"} buttonType={"button"} variant={"success"} buttonText={"Success"} size={"md"}/>
          <Button buttonName={"waring"} buttonType={"button"} variant={"warning"} buttonText={"Warning"} size={"md"}/>
          <Button buttonName={"danger"} buttonType={"button"} variant={"danger"} buttonText={"Danger"} size={"md"}/>
          <Button buttonName={"info"} buttonType={"button"} variant={"info"} buttonText={"Info"} size={"md"}/>
          <Button buttonName={"link"} buttonType={"button"} variant={"link"} buttonText={"Link"} size={"md"}/>
        </div>
      </BasicCard.content>

      {/*Footer*/}
      <BasicCard.footer>
        <div className="text-md font-semibold text-admin-title capitalize">Footer</div>
      </BasicCard.footer>
    </BasicCard>

  );
}
