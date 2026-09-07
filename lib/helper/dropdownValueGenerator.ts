export const dropdownValue = {
  industryType: [
    'Information Technology',
    'Healthcare',
    'Finance',
    'Marketing & Advertising',
    'Education',
    'E-commerce',
    'Real Estate',
    'Manufacturing',
    'Entertainment & Media',
    'Retail',
  ],
  projectType: [
    'Web Development',
    'Mobile App Development',
    'Digital Marketing',
    'Graphic Design',
    'Content Writing',
    'Data Analysis',
    'Product Development',
    'Software Development',
    'Business Consulting',
    'Event Planning',
  ],
  duration: ['Less than 1 month', '1-3 months', '3-6 months', '6-12 months', 'More than 1 year'],
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'oct', 'Nov', 'Dec'],
  monthsToNumber: {
    Jan: 1,
    Feb: 2,
    Mar: 3,
    Apr: 4,
    May: 5,
    Jun: 6,
    Jul: 7,
    Aug: 8,
    Sep: 9,
    oct: 10,
    Nov: 11,
    Dec: 12,
  } as any,

  proficiency: ['Beginner', 'Intermediate', 'Proficient'],
  generateYears: (startYear: number = 1975, endYear: number = new Date().getFullYear()) => {
    return Array.from({ length: endYear - startYear + 1 }, (_, i) =>
      (startYear + i).toString()
    ).reverse()
  },
  generateNumber: (startNumber: number = 1, endNumber: number) => {
    return Array.from({ length: endNumber - startNumber + 1 }, (_, i) =>
      (startNumber + i).toString()
    )
  },
  generateHours: (is24HourFormat: boolean = false) => {
    return Array.from({ length: 24 }, (_, i) => {
      if (is24HourFormat) {
        return `${i.toString().padStart(2, '0')}:00` // 24-hour format (00:00 - 23:00)
      } else {
        const hour = i % 12 || 12 // Convert 0 -> 12 AM, 13 -> 1 PM, etc.
        const period = i < 12 ? 'AM' : 'PM'
        return `${hour}:00 ${period}` // 12-hour format (12:00 AM - 11:00 PM)
      }
    })
  },
}
