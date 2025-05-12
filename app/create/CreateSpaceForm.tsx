"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { formatISO } from "date-fns";
import { toast } from "react-hot-toast";

import Heading from "@/components/Heading";
import CategoryInput from "@/components/inputs/CategoryInput";
import Counter from "@/components/inputs/Counter";
import CountrySelect from "@/components/inputs/CountrySelect";
import ImageUploadSupabase from "@/components/inputs/ImageUploadSupabase";
import Input from "@/components/inputs/Input";
import { categories } from "@/components/navbar/Categories";

import useFormSteps from "@/hook/useFormSteps";
import { createSpace } from "@/app/actions/spaces";
import { DateRange } from "react-date-range";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

const CreateSpaceForm = () => {
  const router = useRouter();
  const {
    step,
    isLoading,
    onBack,
    onNext,
    setCustomValue,
    register,
    handleSubmit,
    watch,
    errors,
  } = useFormSteps();

  const category = watch("category");
  const location = watch("location");
  const guestCount = watch("guestCount");
  const roomCount = watch("roomCount");
  const images = watch("images");
  const price = watch("price");
  const title = watch("title");
  const description = watch("description");
  const disabledDates = watch("disabledDates");
  const minDays = watch("minDays");

  const onSubmit = async (data: any) => {
    if (step !== 5) return onNext();

    try {
      const formattedData = {
        ...data,
        disabledDates: data.disabledDates.map((d: any) => formatISO(d.startDate)),
      };

      await createSpace(formattedData);
      toast.success("Ο χώρος καταχωρήθηκε επιτυχώς!");
      router.push("/");
    } catch (error) {
      toast.error("Κάτι πήγε στραβά.");
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto py-10">
      <form onSubmit={handleSubmit(onSubmit)}>
        {step === 0 && (
          <div className="flex flex-col gap-8">
            <Heading title="Τι αποθηκεύετε;" subtitle="Επιλέξτε κατηγορία" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((item) => (
                <div key={item.label} className="col-span-1">
                  <CategoryInput
                    onClick={(cat) => setCustomValue("category", cat)}
                    selected={category === item.label}
                    label={item.label}
                    icon={item.icon}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-8">
            <Heading title="Τοποθεσία" subtitle="Πού βρίσκεται ο χώρος;" />
            <CountrySelect
              value={location}
              onChange={(val) => setCustomValue("location", val)}
            />
            <Map center={location?.latlng} />
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-8">
            <Heading title="Πληροφορίες" subtitle="Καθορίστε τα χαρακτηριστικά" />
            <Counter
              onChange={(value) => setCustomValue("guestCount", value)}
              value={guestCount}
              title="Άτομα"
              subtitle="Πόσα άτομα μπορεί να φιλοξενήσει"
            />
            <Counter
              onChange={(value) => setCustomValue("roomCount", value)}
              value={roomCount}
              title="Χώροι"
              subtitle="Πόσοι ξεχωριστοί χώροι υπάρχουν;"
            />
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-8">
            <Heading title="Φωτογραφίες" subtitle="Ανεβάστε εικόνες του χώρου" />
            <ImageUploadSupabase
              value={images}
              onChange={(val) => setCustomValue("images", val)}
            />
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col gap-8">
            <Heading title="Περιγραφή" subtitle="Γράψτε μερικές λεπτομέρειες" />
            <Input id="title" label="Τίτλος" disabled={isLoading} register={register} errors={errors} required />
            <Input id="description" label="Περιγραφή" disabled={isLoading} register={register} errors={errors} required />
          </div>
        )}

        {step === 5 && (
          <div className="flex flex-col gap-8">
            <Heading title="Διαθεσιμότητα & Τιμή" subtitle="Πότε και πόσο;" />
            <DateRange
              onChange={(value) => setCustomValue("disabledDates", value)}
              ranges={[disabledDates]}
              direction="horizontal"
              minDate={new Date()}
              showDateDisplay={false}
            />
            <Input id="price" label="Τιμή/μήνα (€)" type="number" disabled={isLoading} register={register} errors={errors} required />
            <Input id="minDays" label="Ελάχιστη Διάρκεια (ημέρες)" type="number" disabled={isLoading} register={register} errors={errors} required />
          </div>
        )}

        <div className="mt-6 flex justify-between">
          {step > 0 && (
            <button type="button" onClick={onBack} className="px-4 py-2 border rounded">
              Πίσω
            </button>
          )}
          <button type="submit" className="px-4 py-2 bg-primary text-white rounded">
            {step === 5 ? "Καταχώριση" : "Επόμενο"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSpaceForm;
