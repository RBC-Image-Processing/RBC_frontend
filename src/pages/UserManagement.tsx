import React, { useState } from 'react';
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

interface User {
  id: string;
  email: string;
  role: 'physician' | 'radiologist' | 'non-specialist';
  verified: boolean;
  active: boolean;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<User['role']>('physician');
  const [searchTerm, setSearchTerm] = useState('');
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingEmail, setEditingEmail] = useState('');

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md')
  );
  const isVeryNarrow = useMediaQuery('(max-width:450px)');

  const handleRegisterUser = () => {
    const newUser: User = {
      id: (users.length + 1).toString(),
      email: newUserEmail,
      role: newUserRole,
      verified: false,
      active: true,
    };
    setUsers([...users, newUser]);
    setNewUserEmail('');
    setNewUserRole('physician');
    setShowRegistrationForm(false);
  };

  const handleRoleChange = (userId: string, newRole: User['role']) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
  };

  const handleEditEmail = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setEditingUserId(userId);
      setEditingEmail(user.email);
    }
  };

  const handleSaveEmail = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, email: editingEmail } : user
      )
    );
    setEditingUserId(null);
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditingEmail('');
  };

  const handleToggleActive = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, active: !user.active } : user
      )
    );
  };

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const UserTable = () => (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
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
          {filteredUsers.map((user) => (
            <TableRow key={user.id} hover>
              <TableCell>
                {editingUserId === user.id ? (
                  <Box display="flex" alignItems="center">
                    <TextField
                      value={editingEmail}
                      onChange={(e) => setEditingEmail(e.target.value)}
                      size="small"
                      fullWidth
                    />
                    <IconButton
                      onClick={() => handleSaveEmail(user.id)}
                      size="small"
                    >
                      <CheckIcon size={18} />
                    </IconButton>
                    <IconButton onClick={handleCancelEdit} size="small">
                      <XIcon size={18} />
                    </IconButton>
                  </Box>
                ) : (
                  <Box display="flex" alignItems="center">
                    {user.email}
                    <IconButton
                      onClick={() => handleEditEmail(user.id)}
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
                    value={user.role}
                    onChange={(e) =>
                      handleRoleChange(user.id, e.target.value as User['role'])
                    }
                    size="small"
                    variant="standard"
                    fullWidth
                  >
                    <MenuItem value="physician">Physician</MenuItem>
                    <MenuItem value="radiologist">Radiologist</MenuItem>
                    <MenuItem value="non-specialist">Non-Specialist</MenuItem>
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
                  label={user.active ? 'Active' : 'Inactive'}
                  color={user.active ? 'success' : 'error'}
                  size="small"
                  sx={{
                    borderRadius: 1,
                    fontSize: isVeryNarrow ? '0.625rem' : '0.75rem',
                  }}
                />
              </TableCell>
              <TableCell>
                <Switch
                  checked={user.active}
                  onChange={() => handleToggleActive(user.id)}
                  size="small"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const UserCards = () => (
    <Grid container spacing={2}>
      {filteredUsers.map((user) => (
        <Grid item xs={12} key={user.id}>
          <Card>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                {editingUserId === user.id ? (
                  <Box display="flex" alignItems="center" width="100%">
                    <TextField
                      value={editingEmail}
                      onChange={(e) => setEditingEmail(e.target.value)}
                      size="small"
                      fullWidth
                    />
                    <IconButton
                      onClick={() => handleSaveEmail(user.id)}
                      size="small"
                    >
                      <CheckIcon size={18} />
                    </IconButton>
                    <IconButton onClick={handleCancelEdit} size="small">
                      <XIcon size={18} />
                    </IconButton>
                  </Box>
                ) : (
                  <>
                    <Typography variant="subtitle1">{user.email}</Typography>
                    <IconButton
                      onClick={() => handleEditEmail(user.id)}
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
                  value={user.role}
                  onChange={(e) =>
                    handleRoleChange(user.id, e.target.value as User['role'])
                  }
                  size="small"
                  variant="standard"
                >
                  <MenuItem value="physician">Physician</MenuItem>
                  <MenuItem value="radiologist">Radiologist</MenuItem>
                  <MenuItem value="non-specialist">Non-Specialist</MenuItem>
                </Select>
                <Chip
                  label={user.verified ? 'Verified' : 'Unverified'}
                  color={user.verified ? 'success' : 'warning'}
                  size="small"
                  sx={{ borderRadius: 1, fontSize: '0.625rem' }}
                />
                <Chip
                  label={user.active ? 'Active' : 'Inactive'}
                  color={user.active ? 'success' : 'error'}
                  size="small"
                  sx={{ borderRadius: 1, fontSize: '0.625rem' }}
                />
                <Switch
                  checked={user.active}
                  onChange={() => handleToggleActive(user.id)}
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
                variant="contained"
                startIcon={<PlusIcon size={18} />}
                onClick={() => setShowRegistrationForm(!showRegistrationForm)}
                fullWidth={isVeryNarrow}
              >
                Add User
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
                  label="Email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  fullWidth
                />
                <Select
                  size="small"
                  value={newUserRole}
                  onChange={(e) =>
                    setNewUserRole(e.target.value as User['role'])
                  }
                  fullWidth
                >
                  <MenuItem value="physician">Physician</MenuItem>
                  <MenuItem value="radiologist">Radiologist</MenuItem>
                  <MenuItem value="non-specialist">Non-Specialist</MenuItem>
                </Select>
                <Button
                  variant="contained"
                  onClick={handleRegisterUser}
                  fullWidth={isMobile}
                >
                  Register
                </Button>
              </Box>
            </Box>
          </Collapse>

          {users.length > 0 ? (
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
                Click the 'Add User' button to register a new user
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default UserManagement;
