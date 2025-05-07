"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { toast } from "react-hot-toast";

import Heading from "@/components/Heading";
import CategoryInput from "@/components/inputs/CategoryInput";
import Counter from "@/components/inputs/Counter";
import CountrySelect from "@/components/inputs/CountrySelect";
import ImageUpload from "@/components/inputs/ImageUpload";
import Input from "@/components/inputs/Input";
import { categories } from "@/components/navbar/Categories";

import useFormSteps from "@/hooks/useFormSteps";
import { createSpace } from "@/actions/spaces";

import { DateRange } from "react-date-range";
import { Range } from "react-date-range";
import { addDays } from "date-fns";

enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  IMAGES = 2,
  AVAILABILITY = 3,
  DETAILS = 4,
}

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

const CreateSpaceForm = () => {
  const router = useRouter();

  const {
    step,
    onNext,
    onBack,
    isFirstStep,
    isLastStep,
    setStep,
  } = useFormSteps();

  const [category, setCategory] = useState<string>('');
  const [location, setLocation] = useState<any>(null);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: addDays(new Date(), 1),
    key: 'selection',
  });
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [minDays, setMinDays] = useState<number>(1);

  const onSubmit = async () => {
    try {
      await createSpace({
        category,
        location,
        imageSrc,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        title,
        description,
        minDays,
      });
      toast.success("Space created!");
      router.refresh();
      setStep(STEPS.CATEGORY);
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  let bodyContent;

  switch (step) {
    case STEPS.CATEGORY:
      bodyContent = (
        <div className="flex flex-col gap-8">
          <Heading
            title="Κατηγορία Χώρου"
            subtitle="Διάλεξε την κατηγορία που ταιριάζει στο χώρο σου"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
            {categories.map((item) => (
              <div key={item.label} className="col-span-1">
                <CategoryInput
                  onClick={(category) => setCategory(category)}
                  selected={category === item.label}
                  label={item.label}
                  icon={item.icon}
                />
              </div>
            ))}
          </div>
        </div>
      );
      break;
    case STEPS.LOCATION:
      bodyContent = (
        <div className="flex flex-col gap-8">
          <Heading title="Τοποθεσία" subtitle="Πού βρίσκεται ο χώρος σου;" />
          <CountrySelect value={location} onChange={(value) => setLocation(value)} />
          <Map center={location?.latlng} />
        </div>
      );
      break;
    case STEPS.IMAGES:
      bodyContent = (
        <div className="flex flex-col gap-8">
          <Heading title="Φωτογραφίες" subtitle="Πρόσθεσε φωτογραφία του χώρου σου" />
          <ImageUpload value={imageSrc} onChange={(value) => setImageSrc(value)} />
        </div>
      );
      break;
    case STEPS.AVAILABILITY:
      bodyContent = (
        <div className="flex flex-col gap-8">
          <Heading title="Διαθεσιμότητα" subtitle="Επίλεξε τις ημερομηνίες διάθεσης του χώρου σου" />
          <DateRange
            ranges={[dateRange]}
            onChange={(item) => setDateRange(item.selection)}
            minDate={new Date()}
            rangeColors={["#262626"]}
          />
        </div>
      );
      break;
    case STEPS.DETAILS:
      bodyContent = (
        <div className="flex flex-col gap-8">
          <Heading title="Λεπτομέρειες" subtitle="Δώσε έναν τίτλο και μια περιγραφή" />
          <Input
            id="title"
            label="Τίτλος"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            id="description"
            label="Περιγραφή"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Counter
            title="Ελάχιστη Διάρκεια Κράτησης"
            subtitle="Σε ημέρες"
            value={minDays}
            onChange={(value) => setMinDays(value)}
          />
        </div>
      );
      break;
  }

  return (
    <div className="max-w-screen-lg mx-auto">
      <div className="pt-8">
        {bodyContent}
      </div>
      <div className="flex justify-between mt-8">
        {!isFirstStep && (
          <button onClick={onBack} className="px-4 py-2 bg-gray-200 rounded-md">
            Πίσω
          </button>
        )}
        <button
          onClick={isLastStep ? onSubmit : onNext}
          className="px-4 py-2 bg-black text-white rounded-md"
        >
          {isLastStep ? "Καταχώριση" : "Επόμενο"}
        </button>
      </div>
    </div>
  );
};

export default CreateSpaceForm;
