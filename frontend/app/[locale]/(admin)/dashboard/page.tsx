import React from 'react';
import Button from "@/component/util/base/Button";

export default function DashboardPage() {
  return (
    <div className={"flex flex-wrap gap-4"}>
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
  );
}
