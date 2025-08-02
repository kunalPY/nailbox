"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Separator } from "@/components/ui/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Settings, RefreshCw, Plus, Trash2 } from "lucide-react"
import { api } from "@/trpc/react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ThreadDisplay } from "./thread-display"
import { ThreadList } from "./thread-list"
import { useLocalStorage } from "usehooks-ts"
import SideBar from "./sidebar"
import SearchBar, { isSearchingAtom } from "./search-bar"
import { useAtom } from "jotai"
import AskAI from "./ask-ai"

interface MailProps {
  defaultLayout: number[] | undefined
  defaultCollapsed?: boolean
  navCollapsedSize: number
}

export function Mail({
  defaultLayout = [20, 32, 48],
  defaultCollapsed = false,
  navCollapsedSize,
}: MailProps) {
  const [done, setDone] = useLocalStorage('normalhuman-done', false)
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)
  const [accountId] = useLocalStorage('accountId', '')
  const [isManageOpen, setIsManageOpen] = React.useState(false)
  const [accountToDelete, setAccountToDelete] = React.useState<string | null>(null)
  
  const { data: accounts, refetch: refetchAccounts } = api.mail.getAccounts.useQuery()
  const deleteAccount = api.mail.deleteAccount.useMutation()
  const syncEmails = api.mail.syncEmails.useMutation()
  
  const handleDeleteAccount = async () => {
    if (!accountToDelete) return
    
    try {
      await deleteAccount.mutateAsync({ accountId: accountToDelete })
      
      // If we deleted the current account, switch to another one
      if (accountToDelete === accountId && accounts && accounts.length > 1) {
        const remainingAccounts = accounts.filter(acc => acc.id !== accountToDelete)
        if (remainingAccounts.length > 0) {
          localStorage.setItem('accountId', JSON.stringify(remainingAccounts[0]!.id))
        }
      }
      
      // Refetch accounts list
      await refetchAccounts()
      toast.success('Account deleted successfully')
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setAccountToDelete(null)
    }
  }


  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(
            sizes
          )}`
        }}
        className="items-stretch h-full min-h-screen"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={15}
          maxSize={40}
          onCollapse={() => {
            setIsCollapsed(true)
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              true
            )}`
          }}
          onResize={() => {
            setIsCollapsed(false)
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              false
            )}`
          }}
          className={cn(
            isCollapsed &&
            "min-w-[50px] transition-all duration-300 ease-in-out"
          )}
        >
          <div className="flex flex-col h-full flex-1">
            <div
              className={cn(
                "flex h-[52px] items-center justify-center gap-1",
                isCollapsed ? "h-[52px]" : "px-2"
              )}
            >
              {!isCollapsed ? (
                <>
                  {/* Manage Accounts Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 justify-start"
                    onClick={() => setIsManageOpen(true)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Accounts
                  </Button>
                  
                  {/* Sync Emails Button */}
                  {accountId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={async () => {
                        try {
                          toast.info('Syncing emails...')
                          await syncEmails.mutateAsync({ accountId })
                          toast.success('Email sync triggered')
                        } catch (error) {
                          toast.error('Failed to sync emails: ' + (error as Error).message)
                        }
                      }}
                      disabled={syncEmails.isPending}
                    >
                      <RefreshCw className={`h-4 w-4 ${syncEmails.isPending ? 'animate-spin' : ''}`} />
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => setIsManageOpen(true)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  {accountId && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                      onClick={async () => {
                        try {
                          toast.info('Syncing emails...')
                          await syncEmails.mutateAsync({ accountId })
                          toast.success('Email sync triggered')
                        } catch (error) {
                          toast.error('Failed to sync emails: ' + (error as Error).message)
                        }
                      }}
                      disabled={syncEmails.isPending}
                    >
                      <RefreshCw className={`h-4 w-4 ${syncEmails.isPending ? 'animate-spin' : ''}`} />
                    </Button>
                  )}
                </>
              )}
            </div>
            <Separator />
            <SideBar isCollapsed={isCollapsed} />
            <div className="flex-1"></div>
            <AskAI isCollapsed={isCollapsed} />
          </div>

        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <Tabs defaultValue="inbox" value={done ? 'done' : 'inbox'} onValueChange={tab => {
            if (tab === 'done') {
              setDone(true)
            } else {
              setDone(false)
            }
          }}>
            <div className="flex items-center px-4 py-2">
              <h1 className="text-xl font-bold">Inbox</h1>
              <TabsList className="ml-auto">
                <TabsTrigger
                  value="inbox"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  Inbox
                </TabsTrigger>
                <TabsTrigger
                  value="done"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  Done
                </TabsTrigger>
              </TabsList>
            </div>
            <Separator />
            <SearchBar />
            <TabsContent value="inbox" className="m-0">
              <ThreadList />
            </TabsContent>
            <TabsContent value="done" className="m-0">
              <ThreadList />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]} minSize={30}>
          <ThreadDisplay />
        </ResizablePanel>
      </ResizablePanelGroup>
      
      {/* Manage Accounts Dialog */}
      <AlertDialog open={isManageOpen} onOpenChange={setIsManageOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Manage Email Accounts</AlertDialogTitle>
            <AlertDialogDescription>
              Add or remove email accounts connected to Nailbox.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-2 py-4">
            {accounts?.map((account) => (
              <div key={account.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-2">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{account.name}</span>
                    <span className="text-xs text-muted-foreground">{account.emailAddress}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setAccountToDelete(account.id)}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            {accounts && accounts.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No accounts connected yet.
              </p>
            )}
            
            {/* Add Account Button */}
            <Button
              variant="outline"
              className="w-full"
              onClick={async () => {
                try {
                  const { getAurinkoAuthorizationUrl } = await import("@/lib/aurinko")
                  const url = await getAurinkoAuthorizationUrl('Office365')
                  window.location.href = url
                } catch (error) {
                  toast.error((error as Error).message)
                }
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Account
            </Button>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!accountToDelete} onOpenChange={(open) => !open && setAccountToDelete(null)}>
        <AlertDialogContent className="z-[60]">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              <span className="font-semibold">
                {accounts?.find(acc => acc.id === accountToDelete)?.emailAddress}
              </span>{" "}
              and all associated emails, threads, and attachments. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAccountToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  )
}
