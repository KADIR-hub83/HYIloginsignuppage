'use client'

// React Imports
import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { UseFormReturn, FieldValues, Path, PathValue } from 'react-hook-form'

// shadcn Imports
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'

// lucide-react Imports
import { Asterisk, CloudUpload, Trash2, Download } from 'lucide-react'

interface FileUploadProps<FormType extends FieldValues> {
  form: UseFormReturn<FormType>
  name: Path<FormType>
  label: string
  onFileSelect?: (file: File | null) => void
  mandatory?: boolean
  isCard?: boolean
  savedFile?: string
}

const UserFileUpload = <FormType extends FieldValues>({
  form,
  name,
  label,
  onFileSelect,
  mandatory = false,
  isCard = true,
  savedFile,
}: FileUploadProps<FormType>) => {
  const [file, setFile] = useState<File | null>(null)
  const [savedUserFile, setSavedUserFile] = useState<string>('')

  useEffect(() => {
    if (savedFile) {
      setSavedUserFile(savedFile)

      form.setValue(name, savedFile as PathValue<FormType, Path<FormType>>)
      form.trigger(name)
    }
  }, [savedFile])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const uploadedFile = acceptedFiles[0]

      if (uploadedFile) {
        setFile(uploadedFile)
        setSavedUserFile('')

        form.setValue(name, uploadedFile as PathValue<FormType, Path<FormType>>)
        form.trigger(name)

        if (onFileSelect) onFileSelect(uploadedFile)
      }
    },
    [form, name, onFileSelect]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    multiple: false,
    maxSize: 5 * 1024 * 1024,
  })

  // const viewFile = () => {
  //   if (savedUserFile) {
  //     window.open(savedUserFile, '_blank')
  //   }
  // }

  const downLoadFile = () => {
    if (savedUserFile) {
      const link = document.createElement('a')
      link.href = savedUserFile
      link.setAttribute('download', savedUserFile.split('/').pop() || 'download')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const removeFile = () => {
    setFile(null)
    setSavedUserFile('')
    form.setValue(name, null as any)
    form.trigger(name)
    if (onFileSelect) onFileSelect(null)
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem>
          <FormLabel
            className={`flex ${isCard ? 'text-lg font-semibold' : 'text-sm font-medium'}  text-card-foreground pb-4`}
          >
            {label}
            {mandatory && (
              <Asterisk strokeWidth={1.75} className="w-4 h-4 block -m-[2px] text-primary" />
            )}
          </FormLabel>
          <FormControl>
            <>
              <div
                className={`relative flex flex-col items-center justify-center p-6 ${isCard ? 'border border-solid bg-background' : 'border border-solid bg-white'} rounded-lg  text-center cursor-pointer ${
                  isDragActive ? 'border-primary' : 'border-border'
                }`}
              >
                {file ? (
                  <div className="flex flex-col items-center space-x-3">
                    <div className="w-fit h-fit bg-white border-2 border-border/60 rounded-full p-1.5">
                      <CloudUpload className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm pt-5">{file.name}</span>
                    <span className="text-sm text-muted-foreground">
                      File size:{' '}
                      {file.size >= 1024 * 1024
                        ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                        : `${(file.size / 1024).toFixed(2)} KB`}
                    </span>
                    <div className="absolute right-0 top-0">
                      <Button variant="ghost" size="icon" onClick={removeFile} type="button">
                        <Trash2 className="w-5 h-5 text-muted-foreground hover:text-muted-foreground/80" />
                      </Button>
                    </div>
                  </div>
                ) : savedUserFile ? (
                  <div className="flex flex-col items-center">
                    <span className="text-sm">
                      {savedUserFile
                        .split('_')
                        .filter((name, index) => index !== 0)
                        .join('')}
                    </span>
                    {/* <div className="absolute right-20 top-0">
                      <Button variant="ghost" size="icon" onClick={() => viewFile()} type="button">
                        <Eye className="w-5 h-5 text-muted-foreground hover:text-muted-foreground/80" />
                      </Button>
                    </div> */}
                    <div className="absolute right-10 top-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => downLoadFile()}
                        type="button"
                      >
                        <Download className="w-5 h-5 text-muted-foreground hover:text-muted-foreground/80" />
                      </Button>
                    </div>
                    <div className="absolute right-0 top-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile()}
                        type="button"
                      >
                        <Trash2 className="w-5 h-5 text-muted-foreground hover:text-muted-foreground/80" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      {...getRootProps()}
                      className="w-full flex flex-col rounded-lg text-center items-center cursor-pointer"
                    >
                      <input {...getInputProps()} />
                      <div className="w-fit h-fit bg-white border-2 border-border/60 rounded-full p-2.5">
                        <CloudUpload className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <p className="mt-2 text-sm font-medium">
                        <span className="text-primary">Click to upload</span>{' '}
                        <span className="font-normal text-muted-foreground">or drag and drop</span>
                      </p>
                      <p className="text-xs text-muted-foreground/70">.doc, .docx, pdf (max 5MB)</p>
                    </div>
                  </>
                )}
              </div>
            </>
          </FormControl>
          <FormMessage className="text-xs" isErrorPresent />
        </FormItem>
      )}
    />
  )
}

export default UserFileUpload
