import SettingsForm from './_components/SettingsForm';
import ChangePasswordDialog from './_components/ChangePasswordDialog';
import PageContainer from '@/components/layout/page-container';

const SettingsPage = () => (
  <PageContainer>
    <div className="flex h-screen">
      <div className="flex-1 p-6">
        <h1 className="mb-6 text-2xl font-semibold">Perfil</h1>
        <SettingsForm />
        <div className="mt-4">
          <ChangePasswordDialog />
        </div>
      </div>
    </div>
  </PageContainer>
);

export default SettingsPage;
