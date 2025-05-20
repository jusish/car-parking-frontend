
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@/hooks/useUsers';
import { PageHeader } from '@/components/CommonComponents/PageHeader';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Pencil } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';

export function UserDetails({open,openChange,selectedId}:{open:boolean,openChange:(open:boolean)=>void,selectedId:string}) {
  const id=selectedId
  const navigate = useNavigate();
  const { data: user, isLoading } = useUser(id || '');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-xl font-semibold">User Not Found</h2>
        <p className="text-muted-foreground mt-2">The requested user could not be found.</p>
        <Button className="mt-4" onClick={() => navigate('/dashboard/users')}>
          Back to Users
        </Button>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="User Details"
        description="View user information"
        backHref="/dashboard/users"
      />

      <div className="grid gap-6">
       

        <Card className='border-none shadow-none '>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">First Name</p>
                <p>{user.firstName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Name</p>
                <p>{user.lastName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p>{user.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">User ID</p>
                <p>{user.id}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created At</p>
                <p>{user.createdAt ? format(new Date(user.createdAt), 'PPP pp') : 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                <p>{user.updatedAt ? format(new Date(user.updatedAt), 'PPP pp') : 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

       
        <div className='w-full '>
            <div className="flex w-full items-center justify-end">
              <Button
              variant="outline"
              className='w-full'
               onClick={()=>openChange(false)}
              >
                Cancel

              </Button>
            </div>
          </div>
      </div>
    </>
  );
}
