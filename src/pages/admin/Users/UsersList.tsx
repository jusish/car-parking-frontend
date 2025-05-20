
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/CommonComponents/PageHeader';
import { useUsers, useDeleteUser } from '@/hooks/useUsers';
import { DataTable, Column } from '@/components/DataTable/DataTable';
import { User } from '@/api/userApi';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
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
} from "@/components/ui/alert-dialog";
import { useAuth } from '@/hooks/useAuth';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { UserDetails } from './UserDetails';
import { EditUser } from './EditUser';
import { CreateUser } from './CreateUser';

export function UsersList() {
  const navigate = useNavigate();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const { user: currentUser } = useAuth();
  const [selectedUser, setSelectedUser] = useState("")
  const [isUserCreateModelOpen, setIsUserCreateModelOpen] = useState(false)
  const [isEditUserModelOpen, setIsEditUserModelOpen] = useState(false)
  const [showUser,setShowUser]=useState(false)

  const { data, isLoading } = useUsers({
    page: pageIndex + 1,
    limit: pageSize,
  });

  const deleteUserMutation = useDeleteUser();

  const handleCreateClick = () => {
  setIsUserCreateModelOpen(true)
  };
  
  const handleEditUser = (userId: string) => {
    setSelectedUser(userId)
    setIsEditUserModelOpen(true)
  };
  
  const handleDeleteUser = (userId: string) => {
    deleteUserMutation.mutate(userId);
  };

  const columns: Column<User>[] = [
    { 
      header: 'ID',
      accessorKey: 'id',
    },
    {
      header: 'Name',
      accessorKey: 'firstName',
      cell: (user) => (
        <span>{`${user.firstName} ${user.lastName}`}</span>
      ),
    },
    {
      header: 'Email',
      accessorKey: 'email',
    },
    {
      header: 'Created At',
      accessorKey: 'createdAt',
      cell: (user) => user.createdAt ? format(new Date(user.createdAt), 'MMM dd, yyyy') : 'N/A',
    },
    {
      header: 'Actions',
      accessorKey: 'id',
      cell: (user) => (
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => {
              setSelectedUser(user.id)
              setShowUser(true)
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => handleEditUser(user.id)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Dialog open={showUser} onOpenChange={setShowUser}>
            <DialogContent>
              <UserDetails selectedId={selectedUser} open={showUser} openChange={setShowUser}  />
            </DialogContent>
          </Dialog>
          <Dialog open={isEditUserModelOpen} onOpenChange={setIsEditUserModelOpen}>
            <DialogContent>
              <EditUser selectedUser={selectedUser} open={isEditUserModelOpen} openChange={setIsEditUserModelOpen}  />
            </DialogContent>
          </Dialog>
          <Dialog open={isUserCreateModelOpen} onOpenChange={setIsUserCreateModelOpen}>
            <DialogContent>
              <CreateUser  open={isUserCreateModelOpen} openChange={setIsUserCreateModelOpen}  />
            </DialogContent>
          </Dialog>
          
          {/* Don't allow deletion of current user */}
          {user.id !== currentUser?.id && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the user account. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader 
        title="Users Management" 
        description="View and manage user accounts"
        actionLabel="Create User"
        onAction={handleCreateClick}
      />

      <DataTable
        columns={columns}
        data={data?.data || []}
        totalItems={data?.totalItems || 0}
        pageSize={pageSize}   
        pageIndex={pageIndex}
        onPageChange={setPageIndex}
        onPageSizeChange={setPageSize}
        onSearch={setSearch}
        isLoading={isLoading}
      />
    </>
  );
}
