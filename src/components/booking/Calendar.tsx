"use client";

import { useState } from "react";
import { format, addDays, startOfToday, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BookingCalendar() {
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const days = Array.from({ length: 7 }, (_, i) => addDays(startOfToday(), i));
  const timeSlots = ["09:00", "10:30", "13:00", "14:30", "16:00"];

  return (
    <div className="bg-white rounded-3xl p-8 shadow-2xl border max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-serif text-brand-primary">Select a Date</h3>
        <div className="flex gap-2">
          <button className="p-2 rounded-full hover:bg-zinc-100"><ChevronLeft className="w-5 h-5" /></button>
          <button className="p-2 rounded-full hover:bg-zinc-100"><ChevronRight className="w-5 h-5" /></button>
        </div>
      </div>

      <div className="flex justify-between mb-12">
        {days.map((day) => (
          <button
            key={day.toISOString()}
            onClick={() => setSelectedDate(day)}
            className={`flex flex-col items-center p-4 rounded-2xl transition-all duration-300 w-16 ${
              isSameDay(day, selectedDate) 
              ? "bg-brand-primary text-brand-secondary shadow-lg scale-110" 
              : "hover:bg-zinc-50"
            }`}
          >
            <span className="text-xs uppercase opacity-60 mb-1">{format(day, "EEE")}</span>
            <span className="text-lg font-bold">{format(day, "d")}</span>
          </button>
        ))}
      </div>

      <h3 className="text-2xl font-serif text-brand-primary mb-6">Available Times</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
        {timeSlots.map((time) => (
          <button
            key={time}
            onClick={() => setSelectedTime(time)}
            className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
              selectedTime === time 
              ? "border-brand-primary bg-brand-primary/5 text-brand-primary font-bold" 
              : "border-zinc-100 hover:border-brand-accent"
            }`}
          >
            <Clock className="w-4 h-4" />
            {time}
          </button>
        ))}
      </div>

      <Button size="lg" className="w-full" disabled={!selectedTime}>
        Confirm Booking for {format(selectedDate, "MMM do")} {selectedTime && `at ${selectedTime}`}
      </Button>
      
      <p className="text-center text-zinc-400 text-sm mt-6">
        * A 20% deposit is required to confirm your slot.
      </p>
    </div>
  );
}
