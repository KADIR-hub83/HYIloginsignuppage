import { useState } from 'react'
import { Assessment } from './types'

export const [filteredAssessments, setFilteredAssessments] = useState<Assessment[]>([])
