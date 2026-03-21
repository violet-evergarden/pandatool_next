'use client'

import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

export default function ExamplesPage() {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Button 组件示例</h2>
        <div className="flex flex-wrap gap-4">
          <Button>Default Button</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>

        <div className="flex flex-wrap gap-4 mt-4">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">🎯</Button>
        </div>

        <div className="flex flex-wrap gap-4 mt-4">
          <Button disabled>Disabled</Button>
          <Button disabled className="gap-2">
            <span className="animate-spin">⏳</span>
            Loading
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Sonner Toast 示例</h2>
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={() => toast('这是一个默认通知')}
          >
            Default Toast
          </Button>
          <Button
            variant="secondary"
            onClick={() => toast.success('操作成功！')}
          >
            Success Toast
          </Button>
          <Button
            variant="destructive"
            onClick={() => toast.error('操作失败！')}
          >
            Error Toast
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.warning('请注意！')}
          >
            Warning Toast
          </Button>
          <Button
            variant="ghost"
            onClick={() => toast.info('提示信息')}
          >
            Info Toast
          </Button>
        </div>

        <div className="flex flex-wrap gap-4 mt-4">
          <Button
            onClick={() =>
              toast('带有描述的通知', {
                description: '这是通知的详细描述信息',
              })
            }
          >
            With Description
          </Button>
          <Button
            onClick={() =>
              toast.success('事件已创建', {
                description: '2024年3月21日 下午3:00',
                action: {
                  label: '撤销',
                  onClick: () => toast.info('已撤销'),
                },
              })
            }
          >
            With Action
          </Button>
          <Button
            onClick={() => {
              const id = toast.loading('正在处理...')
              setTimeout(() => {
                toast.success('处理完成！', { id })
              }, 2000)
            }}
          >
            Loading → Success
          </Button>
          <Button
            onClick={() => toast.promise(
              new Promise((resolve) => setTimeout(resolve, 2000)),
              {
                loading: '正在加载...',
                success: '加载成功！',
                error: '加载失败！',
              }
            )}
          >
            Promise Toast
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">AlertDialog 示例</h2>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">删除账户</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>确定要删除账户吗？</AlertDialogTitle>
              <AlertDialogDescription>
                此操作无法撤销。这将永久删除您的账户并从我们的服务器中删除您的数据。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => toast.success('账户已删除')}
              >
                确认删除
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Dialog 示例</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">编辑资料</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>编辑资料</DialogTitle>
              <DialogDescription>
                在此处修改您的个人信息，完成后点击保存。
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  姓名
                </Label>
                <Input id="name" defaultValue="张三" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  邮箱
                </Label>
                <Input id="email" type="email" defaultValue="zhangsan@example.com" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={() => {
                  toast.success('资料已保存')
                  setDialogOpen(false)
                }}
              >
                保存更改
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
