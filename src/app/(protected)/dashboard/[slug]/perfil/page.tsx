import SettingsForm from './_components/SettingsForm';
import ChangePasswordDialog from './_components/ChangePasswordDialog';
import PageContainer from '@/components/layout/page-container';

const SettingsPage = () => (
  <PageContainer>
    <div className="container mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Perfil</h1>
      <SettingsForm />
      <div className="mt-4">
        <ChangePasswordDialog />
      </div>
    </div>
  </PageContainer>
);

export default SettingsPage;
