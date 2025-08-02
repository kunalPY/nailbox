"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { api, type RouterOutputs } from "@/trpc/react"
import { useLocalStorage } from "usehooks-ts"
import { Plus, Trash2 } from "lucide-react"
import { getAurinkoAuthorizationUrl } from "@/lib/aurinko"
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

interface AccountSwitcherProps {
  isCollapsed: boolean
}

export function AccountSwitcher({
  isCollapsed
}: AccountSwitcherProps) {
  const { data: accounts, refetch: refetchAccounts } = api.mail.getAccounts.useQuery()
  const [accountId, setAccountId] = useLocalStorage('accountId', '')
  const [accountToDelete, setAccountToDelete] = React.useState<string | null>(null)
  const deleteAccount = api.mail.deleteAccount.useMutation()

  React.useEffect(() => {
    if (accounts && accounts.length > 0) {
      if (accountId) return
      setAccountId(accounts[0]!.id)
    } else if (accounts && accounts.length === 0) {
      toast('Link an account to continue', {
        action: {
          label: 'Add account',
          onClick: async () => {
            try {
              const url = await getAurinkoAuthorizationUrl('Office365')
              window.location.href = url
            } catch (error) {
              toast.error((error as Error).message)
            }
          }
        },
      })
    }
  }, [accounts])



  const handleDeleteAccount = async () => {
    if (!accountToDelete) return
    
    try {
      await deleteAccount.mutateAsync({ accountId: accountToDelete })
      
      // If we deleted the current account, switch to another one
      if (accountToDelete === accountId && accounts && accounts.length > 1) {
        const remainingAccounts = accounts.filter(acc => acc.id !== accountToDelete)
        if (remainingAccounts.length > 0) {
          setAccountId(remainingAccounts[0]!.id)
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

  if (!accounts) return <></>
  return (
    <div className="items-center gap-2 flex w-full">
      <Select defaultValue={accountId} onValueChange={setAccountId}>
        <SelectTrigger
          className={cn(
            "flex w-full flex-1 items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
            isCollapsed &&
            "flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden"
          )}
          aria-label="Select account"
        >
          <SelectValue placeholder="Select an account">
            <span className={cn({ "hidden": !isCollapsed })}>
              {
                accounts.find((account) => account.id === accountId)?.emailAddress[0]
              }
            </span>
            <span className={cn("ml-2", isCollapsed && "hidden")}>
              {
                accounts.find((account) => account.id === accountId)
                  ?.emailAddress
              }
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {accounts.map((account) => (
            <div key={account.id} className="relative flex items-center">
              <SelectItem value={account.id} className="flex-1 pr-8">
                <div className="flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
                  {/* {account.icon} */}
                  {account.emailAddress}
                </div>
              </SelectItem>
              {accounts.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setAccountToDelete(account.id)
                  }}
                  className="absolute right-2 p-1 hover:bg-destructive/10 rounded transition-colors"
                  aria-label={`Delete ${account.emailAddress}`}
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                </button>
              )}
            </div>
          ))}
          <div onClick={async (e) => {
            try {
              const url = await getAurinkoAuthorizationUrl('Office365')
              window.location.href = url
            } catch (error) {
              toast.error((error as Error).message)
            }
          }} className="relative flex hover:bg-gray-50 w-full cursor-pointer items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
            <Plus className="size-4 mr-1" />
            Add account
          </div>
        </SelectContent>
      </Select>
      
      <AlertDialog open={!!accountToDelete} onOpenChange={(open) => !open && setAccountToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              <span className="font-semibold">
                {accounts.find(acc => acc.id === accountToDelete)?.emailAddress}
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
    </div>
  )
}
