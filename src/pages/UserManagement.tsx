import React, { useState , useEffect} from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Chip,
  InputAdornment,
  Container,
  Collapse,
  useMediaQuery,
  Theme,
  Card,
  CardContent,
  Grid,
  IconButton,
  Switch,
} from '@mui/material';
import {
  Search as SearchIcon,
  Plus as PlusIcon,
  Users as UsersIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  X as XIcon,
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import {UserList, EditingUser} from "../types/index"
import HashLoader from "react-spinners/HashLoader";


const UserManagement: React.FC = () => {
  const [fullName, setfullName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserList['role']>('PHYSICIAN');
  const [searchTerm, setSearchTerm] = useState('');
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [editingUser, setEditingUser] = useState<EditingUser | null>(null);
  const [editingEmail, setEditingEmail] = useState('');
  const [editingfullName, setEditingfullName] = useState('');
  const [isUpdateSuccess, setIsUpdateSuccess] = useState(false);

    const {loading, users,getUsers, registerUser, updateUser, sendActivateAccountRequest} = useUser();

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md')
  );
  const isVeryNarrow = useMediaQuery('(max-width:450px)');



useEffect(() => {
  if (isUpdateSuccess) {
    getUsers(); // Fetch the updated user data
    setIsUpdateSuccess(false); // Reset the flag after fetching users
  }
}, [isUpdateSuccess]);

useEffect(() => {
  //Only Load the users when the user object is empty
  if(users&&users.length ==0){
    getUsers();
  }
  
} ,[]);


  const handleRegisterUser = async() =>  {
try {
      
    if(await  registerUser(fullName,newUserRole,newUserEmail)){

      //send an email to the newly created user 
      await sendActivateAccountRequest(newUserEmail);

      setShowRegistrationForm(false);
      clearUserInfo()
      setIsUpdateSuccess(true);
   }
} catch (error) {
  console.error('Failed to register user:', error);
}
  
  };


  const clearUserInfo= () =>{
    setfullName('');
    setNewUserEmail('');
    setNewUserRole('PHYSICIAN');
  }

  const handleRoleChange =  async(userId: string, newRole: UserList['role']) => {

    try {
      await updateUser(userId, { roleId: newRole });
      setIsUpdateSuccess(true); 
       setEditingUser(null);
      
    } catch (error) {
      console.error('Failed to update role:', error);
      
    }
  };

  const handleEditEmail =  async (userId: string, isEmail:boolean) => {
    const user = users&&users.find((u) => u.userId === userId);
    if (user) {
      setEditingUser({userId:userId,isEmail:isEmail});
      setEditingEmail(user.email);
    }
    
  };

  const handleEditFullName = (userId: string, isEmail: boolean) => {
    const user = users&&users.find((u) => u.userId === userId);
    if (user) {
        setEditingUser({userId:userId, isEmail:isEmail});
      setEditingfullName(user.fullName);
    }
  };

const handleSaveEmail = async (userId: string) => {
  try {
    await updateUser(userId, { email: editingEmail });
    setIsUpdateSuccess(true); // Trigger re-fetching of users
    setEditingUser(null);
  } catch (error) {
    console.error('Failed to update email:', error);
  }
};

const handleSaveFullName = async (userId: string) => {
  try {
    await updateUser(userId, { fullName: editingfullName });
    setIsUpdateSuccess(true); // Trigger re-fetching of users
    setEditingUser(null);
  } catch (error) {
    console.error('Failed to update full name:', error);
  }
};

const handleToggleActive = async (userId: string, isActive: boolean) => {
  try {
    await updateUser(userId, { isActive });
    setIsUpdateSuccess(true); // Trigger re-fetching of users
  } catch (error) {
    console.error('Failed to toggle active status:', error);
  }
};

   const handleCancelEdit = (isEmail:boolean) => {
    setEditingUser(null);
    if(isEmail){
      setEditingEmail('');}
      else{
        setEditingfullName('');
      }
  };

  



  const filteredUsers = users && users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const UserTable = () => (
    <TableContainer>
     {loading ?   <Box
  sx={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '50vh', // Full viewport height for vertical centering
    bgcolor: 'background.default',
  }}
>
  <HashLoader
    color={"#005A9C"} // Use MUI theme color
    loading={true}
    size={50}
    speedMultiplier={1}
  />
</Box>: <Table>
        <TableHead>
          <TableRow>
                 <TableCell sx={{ fontWeight: 'bold' }}>Full Name</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
            {!isVeryNarrow && (
              <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
            )}
            <TableCell sx={{ fontWeight: 'bold' }}>Verified</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredUsers&&filteredUsers.map((user) => (
            <TableRow key={user.userId} hover>
                <TableCell>
                {editingUser && !editingUser.isEmail &&  editingUser.userId === user.userId  ? (
                  <Box display="flex" alignItems="center">
                    <TextField
                      value={editingfullName}
                      onChange={(e) => setEditingfullName(e.target.value)}
                      size="small"
                      fullWidth
                    />
                    <IconButton
                      onClick={() => handleSaveFullName(user.userId)}
                      size="small"
                    >
                      <CheckIcon size={18} />
                    </IconButton>
                    <IconButton onClick={()=>handleCancelEdit(false)} size="small">
                      <XIcon size={18} />
                    </IconButton>
                  </Box>
                ) : (
                  <Box display="flex" alignItems="center">
                    {user.fullName}
                    <IconButton
                      onClick={() => handleEditFullName(user.userId,false)}
                      size="small"
                    >
                      <EditIcon size={18} />
                    </IconButton>
                  </Box>
                )}
              </TableCell>
              <TableCell>
                    {editingUser && editingUser.isEmail &&  editingUser.userId === user.userId  ? (
                  <Box display="flex" alignItems="center">
                    <TextField
                      value={editingEmail}
                      onChange={(e) => setEditingEmail(e.target.value)}
                      size="small"
                      fullWidth
                    />
                    <IconButton
                      onClick={() => handleSaveEmail(user.userId)}
                      size="small"
                    >
                      <CheckIcon size={18} />
                    </IconButton>
                    <IconButton onClick={()=>handleCancelEdit(true)} size="small">
                      <XIcon size={18} />
                    </IconButton>
                  </Box>
                ) : (
                  <Box display="flex" alignItems="center">
                    {user.email}
                    <IconButton
                      onClick={() => handleEditEmail(user.userId,true)}
                      size="small"
                    >
                      <EditIcon size={18} />
                    </IconButton>
                  </Box>
                )}
              </TableCell>
              {!isVeryNarrow && (
                <TableCell>
                  <Select
                   value={user.Role.roleId}
                    onChange={(e) =>
                      handleRoleChange(user.userId, e.target.value as UserList['role'])
                    }
                    size="small"
                    variant="standard"
                    fullWidth
                  >
                    <MenuItem value={2}>Physician</MenuItem>
                      <MenuItem value={4}>Administrator</MenuItem>
                    <MenuItem value={3}>Radiologist</MenuItem>
                    <MenuItem value={1}>Non-Specialist</MenuItem>
                  </Select>
                </TableCell>
              )}
              <TableCell>
                <Chip
                  label={user.verified ? 'Verified' : 'Unverified'}
                  color={user.verified ? 'success' : 'warning'}
                  size="small"
                  sx={{
                    borderRadius: 1,
                    fontSize: isVeryNarrow ? '0.625rem' : '0.75rem',
                  }}
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={user.isActive ? 'Active' : 'Inactive'}
                  color={user.isActive ? 'success' : 'error'}
                  size="small"
                  sx={{
                    borderRadius: 1,
                    fontSize: isVeryNarrow ? '0.625rem' : '0.75rem',
                  }}
                />
              </TableCell>
              <TableCell>
                <Switch
                  checked={user.isActive}
                  onChange={() => handleToggleActive(user.userId, !user.isActive)}
                  size="small"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>}
    </TableContainer>
  );

  const UserCards = () => (
    <Grid container spacing={2}>
      {filteredUsers&&filteredUsers.map((user) => (
        <Grid item xs={12} key={user.userId}>
          <Card>
            <CardContent>
                 <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                  {editingUser && !editingUser.isEmail &&  editingUser.userId === user.userId  ? (
                  <Box display="flex" alignItems="center" width="100%">
                    <TextField
                      value={editingfullName}
                      onChange={(e) => setEditingfullName(e.target.value)}
                      size="small"
                      fullWidth
                    />
                    <IconButton
                      onClick={() => handleSaveFullName(user.userId)}
                      size="small"
                    >
                      <CheckIcon size={18} />
                    </IconButton>
                    <IconButton onClick={()=>handleCancelEdit(false)} size="small">
                      <XIcon size={18} />
                    </IconButton>
                  </Box>
                ) : (
                  <>
                    <Typography variant="subtitle1">{user.fullName}</Typography>
                    <IconButton
                      onClick={() => handleEditFullName(user.userId,false)}
                      size="small"
                    >
                      <EditIcon size={18} />
                    </IconButton>
                  </>
                )}
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                {editingUser && editingUser.isEmail &&  editingUser.userId === user.userId  ? (
                  <Box display="flex" alignItems="center" width="100%">
                    <TextField
                      value={editingEmail}
                      onChange={(e) => setEditingEmail(e.target.value)}
                      size="small"
                      fullWidth
                    />
                    <IconButton
                      onClick={() => handleSaveEmail(user.userId)}
                      size="small"
                    >
                      <CheckIcon size={18} />
                    </IconButton>
                    <IconButton onClick={()=>handleCancelEdit(true)} size="small">
                      <XIcon size={18} />
                    </IconButton>
                  </Box>
                ) : (
                  <>
                    <Typography variant="subtitle1">{user.email}</Typography>
                    <IconButton
                      onClick={() => handleEditEmail(user.userId,true)}
                      size="small"
                    >
                      <EditIcon size={18} />
                    </IconButton>
                  </>
                )}
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Select
                  value={user.Role.roleId}
                  onChange={(e) =>
                    handleRoleChange(user.userId, e.target.value as UserList['role'])
                  }
                  size="small"
                  variant="standard"
                >
                 <MenuItem value={2}>Physician</MenuItem>
                  <MenuItem value={4}>Administrator</MenuItem>
                  <MenuItem value={3}>Radiologist</MenuItem>
                  <MenuItem value={1}>Non-Specialist</MenuItem>
                </Select>
                <Chip
                  label={user.verified ? 'Verified' : 'Unverified'}
                  color={user.verified ? 'success' : 'warning'}
                  size="small"
                  sx={{ borderRadius: 1, fontSize: '0.625rem' }}
                />
                <Chip
                  label={user.isActive ? 'Active' : 'Inactive'}
                  color={user.isActive ? 'success' : 'error'}
                  size="small"
                  sx={{ borderRadius: 1, fontSize: '0.625rem' }}
                />
                <Switch
                  checked={user.isActive}
                  onChange={() => handleToggleActive(user.userId, user.isActive)}
                  size="small"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Container maxWidth="lg" disableGutters={isMobile}>
      <Box sx={{ py: 2, px: isMobile ? 2 : 3 }}>
        <Typography
          variant="h4"
          gutterBottom
          fontWeight="bold"
          color="primary"
          textAlign="center"
          fontSize={isMobile ? '1.5rem' : '2.125rem'}
        >
          User Management
        </Typography>

        <Paper
          elevation={2}
          sx={{ mt: 2, p: isMobile ? 2 : 3, borderRadius: 2 }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: 'space-between',
              alignItems: isMobile ? 'stretch' : 'center',
              mb: 2,
              gap: 2,
            }}
          >
            <Typography
              variant="h6"
              fontWeight="medium"
              fontSize={isMobile ? '1rem' : '1.25rem'}
            >
              Registered Users
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: isVeryNarrow ? 'column' : 'row',
                gap: 1,
              }}
            >
              <TextField
                size="small"
                placeholder="Search users"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                variant="outlined"
                fullWidth={isVeryNarrow}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon size={18} />
                    </InputAdornment>
                  ),
                }}
              />
        
                   <Button
                  fullWidth={isVeryNarrow}
                    variant="contained"
                  onClick={() => setShowRegistrationForm(!showRegistrationForm)}
                  startIcon={ <PlusIcon />}
                >
       Add user
          </Button>


            </Box>
          </Box>

          <Collapse in={showRegistrationForm}>
            <Box
              sx={{
                mb: 2,
                p: 2,
                bgcolor: 'background.default',
                borderRadius: 1,
              }}
            >
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                Register New User
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: 2,
                }}
              >
                  <TextField
                  size="small"
                  label="Full Name"
                  value={fullName}
                  onChange={(e) => setfullName(e.target.value)}
                  fullWidth
                />
                <TextField
                  size="small"
                  label="Email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  fullWidth
                />
                <Select
                  size="small"
                  value={newUserRole}
                  onChange={(e) =>
                   setNewUserRole(e.target.value as UserList['role'])
                  }
                  fullWidth
                >
                  <MenuItem value="4">Administrator</MenuItem>
                  <MenuItem value="2">Physician</MenuItem>
                  <MenuItem value="3">Radiologist</MenuItem>
                  <MenuItem value="1">Non-Specialist</MenuItem>
                </Select>
               

      <Button
             variant="contained"
           onClick={handleRegisterUser}
       
                >
            {loading ? <CircularProgress size={20} color="inherit" /> : "Register"}
          </Button>

              </Box>
            </Box>
          </Collapse>

          {users&&users.length > 0 ? (
            isMobile ? (
              <UserCards />
            ) : (
              <UserTable />
            )
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: 200,
                bgcolor: 'background.default',
                borderRadius: 2,
              }}
            >
              <UsersIcon size={isMobile ? 48 : 64} color="#ccc" />
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mt: 2, fontSize: isMobile ? '1rem' : '1.25rem' }}
              >
                No users registered yet
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1, textAlign: 'center' }}
              >
                Click the Add User button to register a new user
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default UserManagement;
