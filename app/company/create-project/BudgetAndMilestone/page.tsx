'use client'
import Image from 'next/image'
import { useState } from 'react'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
// shadcn Imports
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

// svg imports
import BackIcon from '@/public/company/back-icon.svg'
import ArrowRightIcon from '@/public/company/arrow-right-icon.svg'

export default function Step3({ initialData, handlePrevStep, handleNextStep }: any) {
  const [date, setDate] = useState<Date>()
  return (
    <>
      <section className="flex justify-center w-full flex-col items-center px-4 sm:px-6 md:px-8">
        <form className="space-y-8 p-4 sm:p-6 w-full max-w-xl">
          <div className="w-full border rounded p-4 sm:p-6 mb-4 sm:mb-12">
            <div className="flex flex-col gap-1.5 pt-2 pb-2">
              <Label className="text-sm font-normal">Budget</Label>
              <ToggleGroup type="single" className="flex flex-wrap gap-2 sm:gap-4 justify-start">
                <ToggleGroupItem
                  className="bg-muted font-normal text-xs px-4 py-2 sm:px-6 sm:py-2 border border-gray-300 rounded-md"
                  value="hour-rate"
                  aria-label="Toggle hour-rate"
                >
                  Hourly Rate
                </ToggleGroupItem>
                <ToggleGroupItem
                  className="bg-muted font-normal text-xs px-4 py-2 sm:px-6 sm:py-2 border border-gray-300 rounded-md"
                  value="fixed-project"
                  aria-label="Toggle fixed-project"
                >
                  Fixed Project
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <div className="flex-1 flex flex-col gap-1.5 pt-2 pb-2">
                <Label className="text-sm font-normal">Starting from</Label>
                <Select>
                  <SelectTrigger className="w-full h-10 px-4 py-1.5 rounded-sm border border-[#4A4A4A]">
                    <SelectValue placeholder="Select starting range" />
                  </SelectTrigger>
                  <SelectContent className="border border-[#4A4A4A] rounded-sm">
                    <SelectItem className="select-item" value="us-30">
                      US$ 30
                    </SelectItem>
                    <SelectItem className="select-item" value="us-40">
                      US$ 40
                    </SelectItem>
                    <SelectItem className="select-item" value="us-50">
                      US$ 50
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 flex flex-col gap-1.5 pt-2 pb-2">
                <Label className="text-sm font-normal">To</Label>
                <Select>
                  <SelectTrigger className="w-full h-10 px-4 py-1.5 rounded-sm border border-[#4A4A4A]">
                    <SelectValue placeholder="Select ending range" />
                  </SelectTrigger>
                  <SelectContent className="border border-[#4A4A4A] rounded-sm">
                    <SelectItem className="select-item" value="us-60">
                      US$ 60
                    </SelectItem>
                    <SelectItem className="select-item" value="us-70">
                      US$ 70
                    </SelectItem>
                    <SelectItem className="select-item" value="us-80">
                      US$ 80
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="w-full border rounded mb-6 p-4 sm:p-6">
            <div className="font-medium text-lg">Milestones</div>
            <div className="flex flex-col gap-1.5 pt-4 pb-4 sm:pb-6">
              <Label className="text-sm font-normal">Milestones</Label>
              <Input className="h-10" type="text" name="name" placeholder="Enter Milestones" />
            </div>
            <div className="flex flex-col gap-1.5 pt-2 pb-4 sm:pb-6">
              <Label className="text-sm font-normal">Description</Label>
              <Input className="h-10" type="text" name="name" placeholder="Enter Description" />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <div className="flex-1 flex flex-col gap-1.5 pt-2 pb-2">
                <Label className="text-sm font-normal">Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={`w-full sm:w-[240px] h-10 justify-start text-left font-normal ${!date ? 'text-muted-foreground' : ''}`}
                    >
                      {date ? format(date, 'PPP') : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex-1 flex flex-col gap-1.5 pt-2 pb-2">
                <Label className="text-sm font-normal">Amount</Label>
                <Input className="h-10" type="text" name="name" placeholder="Enter Amount" />
              </div>
            </div>
          </div>
          <div className="w-full border rounded mb-6 p-4 sm:p-6">
            <div className="font-medium text-lg">Preference</div>
            <div className="text-sm font-normal text-muted-foreground pb-2">
              Select how many seats you need.
            </div>
            <div className="flex flex-col gap-1.5 pt-4 pb-4 sm:pb-6">
              <Label className="text-sm font-normal">Job types</Label>
              <ToggleGroup type="single" className="flex flex-wrap gap-2 sm:gap-4 justify-start">
                <ToggleGroupItem
                  className="bg-muted font-normal text-xs px-4 py-2 sm:px-6 sm:py-2 border border-gray-300 rounded-md"
                  value="junior"
                  aria-label="Toggle junior"
                >
                  Junior (0-2 years)
                </ToggleGroupItem>
                <ToggleGroupItem
                  className="bg-muted font-normal text-xs px-4 py-2 sm:px-6 sm:py-2 border border-gray-300 rounded-md"
                  value="mid"
                  aria-label="Toggle mid"
                >
                  Mid-Level (3-6 years)
                </ToggleGroupItem>
                <ToggleGroupItem
                  className="bg-muted font-normal text-xs px-4 py-2 sm:px-6 sm:py-2 border border-gray-300 rounded-md"
                  value="senior"
                  aria-label="Toggle senior"
                >
                  Senior (7+ years)
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <div className="flex flex-col gap-1.5 pt-2 pb-4 sm:pb-6">
              <Label className="text-sm font-normal">Language Requirements</Label>
              <Input
                className="h-10"
                type="text"
                name="name"
                placeholder="Enter Language Requirements"
              />
            </div>
            <div className="flex flex-col gap-1.5 pt-2 pb-4 sm:pb-6">
              <Label className="text-sm font-normal">Timezone</Label>
              <Input
                className="h-10"
                type="text"
                name="name"
                placeholder="Enter Language Requirements"
              />
            </div>
          </div>
          <div className="max-w-4xl w-full flex justify-between">
            <Button variant="ghost" onClick={handlePrevStep}>
              <Image src={BackIcon} alt="Back Icon" />
            </Button>
            <Button type="submit" onClick={handleNextStep} className="pr-12 pl-12">
              Continue
              <Image src={ArrowRightIcon} alt="Arrow Right Icon" />
            </Button>
          </div>
        </form>
      </section>
    </>
  )
}
