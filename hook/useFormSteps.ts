"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";

const useFormSteps = () => {
  const [step, setStep] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      category: "",
      location: null,
      guestCount: 1,
      roomCount: 1,
      bathroomCount: 1,
      imageSrc: [],
      price: 1,
      title: "",
      description: "",
      startDate: undefined,
      endDate: undefined,
    },
  });

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const onNext = () => setStep((value) => value + 1);
  const onBack = () => setStep((value) => value - 1);

  return {
    step,
    setStep,
    onNext,
    onBack,
    register,
    handleSubmit,
    watch,
    setCustomValue,
    errors,
    getValues,
    isLoading: isSubmitting,
  };
};

export default useFormSteps;
