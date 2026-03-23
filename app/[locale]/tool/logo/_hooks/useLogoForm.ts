/**
 * Logo 表单状态管理 Hook
 */

import { useState, useCallback } from 'react'
import type { LogoFormData, LogoFormField } from '../_types'
import { DEFAULT_FORM_DATA } from '../_constants'

export function useLogoForm() {
  const [formData, setFormData] = useState<LogoFormData>(DEFAULT_FORM_DATA)
  const [logoPreview, setLogoPreview] = useState<string | undefined>(undefined)

  /** 更新单个字段 */
  const updateField = useCallback((field: LogoFormField, value: string | File | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  /** 重置表单 */
  const resetForm = useCallback(() => {
    setFormData(DEFAULT_FORM_DATA)
    setLogoPreview(undefined)
  }, [])

  /** 更新 Logo 预览 */
  const updatePreview = useCallback((url: string | undefined | null) => {
    setLogoPreview(url ?? undefined)
  }, [])

  return {
    formData,
    logoPreview,
    updateField,
    resetForm,
    updatePreview,
  }
}

export type LogoFormState = ReturnType<typeof useLogoForm>
