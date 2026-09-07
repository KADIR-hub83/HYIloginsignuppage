'use client'
import { useState } from 'react'

import BasicDetailsForm from './BasicDetailsForm/page'
import ScopeAndSkill from './ScopeAndSkill/page'
import BudgetAndMilestone from './BudgetAndMilestone/page'

const CreateProject = () => {
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [formData, setFormData] = useState({})

  const steps = [
    { id: 0, title: 'Basic Details' },
    { id: 1, title: 'Scope & Skill' },
    { id: 2, title: 'Budget & Milestone' },
  ]

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicDetailsForm
            initialData={formData}
            handlePrevStep={handlePrevStep}
            handleNextStep={handleNextStep}
          />
        )
      case 1:
        return (
          <ScopeAndSkill
            initialData={formData}
            handlePrevStep={handlePrevStep}
            handleNextStep={handleNextStep}
          />
        )
      case 2:
        return (
          <BudgetAndMilestone
            initialData={formData}
            handlePrevStep={handlePrevStep}
            handleNextStep={handleNextStep}
          />
        )
      default:
        return null
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-4">
      <div className="text-2xl font-semibold text-center pb-2 flex items-center justify-center lg:text-start">
        Create Project
      </div>
      <div className="text-md font-normal text-muted-foreground pb-6 flex items-center justify-center lg:text-start">
        This makes your job post more appealing to the right candidates.
      </div>
      {renderStepContent()}
    </div>
  )
}

export default CreateProject
