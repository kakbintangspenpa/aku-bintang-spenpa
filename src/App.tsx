import React, { useState, useEffect } from 'react';
import { User, Role, HabitDefinition, JournalEntry, TeacherCoaching, ParentFeedback } from './types';
import { authService } from './services/authService';
import { storageService } from './services/storageService';

// Components
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { JournalModal } from './components/JournalModal';
import { PhotoViewerModal } from './components/PhotoViewerModal';
import { ApresiasiModal } from './components/ApresiasiModal';
import { PembinaanModal } from './components/PembinaanModal';
import { ParentFeedbackModal } from './components/ParentFeedbackModal';
import { PanduanIntegrasiModal } from './components/PanduanIntegrasiModal';

// Views
import { LoginView } from './views/LoginView';
import { SiswaDashboard } from './views/SiswaDashboard';
import { GuruDashboard } from './views/GuruDashboard';
import { OrangTuaDashboard } from './views/OrangTuaDashboard';
import { AdminDashboard } from './views/AdminDashboard';
import { LaporanView } from './views/LaporanView';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(authService.getCurrentUser());
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // Database states
  const [users, setUsers] = useState(storageService.getUsers());
  const [classes, setClasses] = useState(storageService.getClasses());
  const [journals, setJournals] = useState(storageService.getJournals());
  const [coachings, setCoachings] = useState(storageService.getCoachings());
  const [feedbacks, setFeedbacks] = useState(storageService.getFeedbacks());
  const [badges, setBadges] = useState(storageService.getBadges());
  const [auditLogs, setAuditLogs] = useState(storageService.getAuditLogs());
  const [driveConfig, setDriveConfig] = useState(storageService.getDriveConfig());

  // Modal states
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);
  const [selectedHabitForJournal, setSelectedHabitForJournal] = useState<HabitDefinition | undefined>();
  const [selectedJournalForEdit, setSelectedJournalForEdit] = useState<JournalEntry | undefined>();

  const [isPhotoViewerOpen, setIsPhotoViewerOpen] = useState(false);
  const [photoViewerUrl, setPhotoViewerUrl] = useState('');
  const [photoViewerTitle, setPhotoViewerTitle] = useState('');

  const [isApresiasiModalOpen, setIsApresiasiModalOpen] = useState(false);
  const [selectedJournalForApresiasi, setSelectedJournalForApresiasi] = useState<JournalEntry | null>(null);

  const [isPembinaanModalOpen, setIsPembinaanModalOpen] = useState(false);
  const [preSelectedStudentId, setPreSelectedStudentId] = useState<string | undefined>();
  const [selectedCoachingForEdit, setSelectedCoachingForEdit] = useState<TeacherCoaching | null>(null);

  const [isParentFeedbackModalOpen, setIsParentFeedbackModalOpen] = useState(false);
  const [activeChildForFeedback, setActiveChildForFeedback] = useState<User | null>(null);

  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  // Subscribe to auth session changes
  useEffect(() => {
    const unsubscribe = authService.subscribe((user) => {
      setCurrentUser(user);
      setCurrentTab('dashboard');
    });
    return () => unsubscribe();
  }, []);

  const refreshAllData = () => {
    setUsers(storageService.getUsers());
    setClasses(storageService.getClasses());
    setJournals(storageService.getJournals());
    setCoachings(storageService.getCoachings());
    setFeedbacks(storageService.getFeedbacks());
    setBadges(storageService.getBadges());
    setAuditLogs(storageService.getAuditLogs());
    setDriveConfig(storageService.getDriveConfig());
  };

  // Open Journal modal
  const handleOpenJournalModal = (habit?: HabitDefinition, existing?: JournalEntry) => {
    setSelectedHabitForJournal(habit);
    setSelectedJournalForEdit(existing);
    setIsJournalModalOpen(true);
  };

  // Open Photo Viewer
  const handleViewPhoto = (url: string, title: string) => {
    setPhotoViewerUrl(url);
    setPhotoViewerTitle(title);
    setIsPhotoViewerOpen(true);
  };

  // Open Apresiasi Modal (Teacher)
  const handleOpenApresiasiModal = (journal: JournalEntry) => {
    setSelectedJournalForApresiasi(journal);
    setIsApresiasiModalOpen(true);
  };

  // Open Pembinaan Modal (Teacher)
  const handleOpenPembinaanModal = (studentId?: string, existing?: TeacherCoaching) => {
    setPreSelectedStudentId(studentId);
    setSelectedCoachingForEdit(existing || null);
    setIsPembinaanModalOpen(true);
  };

  // Open Parent Feedback Modal
  const handleOpenParentFeedbackModal = (child: User) => {
    setActiveChildForFeedback(child);
    setIsParentFeedbackModalOpen(true);
  };

  // If user is not logged in, show Login view
  if (!currentUser) {
    return (
      <>
        <LoginView
          onLoginSuccess={() => refreshAllData()}
          onOpenGuide={() => setIsGuideModalOpen(true)}
        />
        <PanduanIntegrasiModal
          isOpen={isGuideModalOpen}
          onClose={() => setIsGuideModalOpen(false)}
        />
      </>
    );
  }

  // Count pending verifications for teacher badge in bottom nav
  const pendingCount = journals.filter(j => !j.guruVerified).length;

  const renderMainContent = () => {
    if (currentTab === 'reports' && currentUser.role !== 'siswa') {
      return (
        <LaporanView
          currentUser={currentUser}
          students={users.filter(u => u.role === 'siswa')}
          teachers={users.filter(u => u.role === 'guru')}
          classes={classes}
          journals={journals}
          coachings={coachings}
          feedbacks={feedbacks}
          onBackToDashboard={() => setCurrentTab('dashboard')}
        />
      );
    }

    switch (currentUser.role) {
      case 'siswa':
        return (
          <SiswaDashboard
            currentUser={currentUser}
            journals={journals}
            badges={badges}
            onOpenJournalModal={handleOpenJournalModal}
            onViewPhoto={handleViewPhoto}
            activeSubTab={currentTab}
            onSelectTab={setCurrentTab}
          />
        );

      case 'guru':
        return (
          <GuruDashboard
            currentUser={currentUser}
            students={users.filter(u => u.role === 'siswa')}
            classes={classes}
            journals={journals}
            coachings={coachings}
            onOpenApresiasiModal={handleOpenApresiasiModal}
            onOpenPembinaanModal={handleOpenPembinaanModal}
            onViewPhoto={handleViewPhoto}
            onOpenReportView={() => setCurrentTab('reports')}
            activeSubTab={currentTab}
          />
        );

      case 'orang_tua':
        return (
          <OrangTuaDashboard
            currentUser={currentUser}
            students={users.filter(u => u.role === 'siswa')}
            journals={journals}
            coachings={coachings}
            feedbacks={feedbacks}
            onOpenParentFeedbackModal={handleOpenParentFeedbackModal}
            onViewPhoto={handleViewPhoto}
            onOpenReportView={() => setCurrentTab('reports')}
            activeSubTab={currentTab}
          />
        );

      case 'admin':
        return (
          <AdminDashboard
            currentUser={currentUser}
            users={users}
            classes={classes}
            journals={journals}
            auditLogs={auditLogs}
            driveConfig={driveConfig}
            onRefreshData={refreshAllData}
            onOpenGuide={() => setIsGuideModalOpen(true)}
            activeSubTab={currentTab}
          />
        );

      default:
        return <div>Peran tidak dikenal</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans flex flex-col antialiased selection:bg-red-500 selection:text-white">
      {/* 1. Top Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onOpenGuide={() => setIsGuideModalOpen(true)}
      />

      {/* 3. Main Body Content (pb-24 on mobile so bottom nav does not overlap content) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8 pb-24 md:pb-8">
        {renderMainContent()}
      </main>

      {/* 4. Native App Style Mobile Bottom Navigation */}
      <BottomNav
        role={currentUser.role}
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        pendingCount={pendingCount}
      />

      {/* 5. Desktop Footer */}
      <footer className="bg-white border-t border-slate-200 py-3.5 px-6 text-center text-xs text-slate-500 hidden md:block print:hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <span>
            <strong>7 Kebiasaan Anak Indonesia Hebat</strong> &bull; Karakter Unggul untuk Indonesia Emas
          </span>
          <div className="flex items-center gap-3">
            {currentUser.role === 'admin' && (
              <>
                <button
                  onClick={() => setIsGuideModalOpen(true)}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Dokumentasi Google Drive & Sheets
                </button>
                <span>&bull;</span>
              </>
            )}
            <span className="text-slate-400">Versi 1.1 Mobile-Optimized</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {isJournalModalOpen && (
        <JournalModal
          isOpen={isJournalModalOpen}
          onClose={() => setIsJournalModalOpen(false)}
          currentUser={currentUser}
          selectedHabit={selectedHabitForJournal}
          existingEntry={selectedJournalForEdit}
          onSaved={refreshAllData}
        />
      )}

      {isPhotoViewerOpen && (
        <PhotoViewerModal
          isOpen={isPhotoViewerOpen}
          onClose={() => setIsPhotoViewerOpen(false)}
          imageUrl={photoViewerUrl}
          title={photoViewerTitle}
        />
      )}

      {isApresiasiModalOpen && selectedJournalForApresiasi && (
        <ApresiasiModal
          isOpen={isApresiasiModalOpen}
          onClose={() => setIsApresiasiModalOpen(false)}
          journal={selectedJournalForApresiasi}
          guruUser={currentUser}
          onSaved={refreshAllData}
        />
      )}

      {isPembinaanModalOpen && (
        <PembinaanModal
          isOpen={isPembinaanModalOpen}
          onClose={() => setIsPembinaanModalOpen(false)}
          guruUser={currentUser}
          students={users.filter(u => u.role === 'siswa')}
          preSelectedStudentId={preSelectedStudentId}
          existingCoaching={selectedCoachingForEdit}
          onSaved={refreshAllData}
        />
      )}

      {isParentFeedbackModalOpen && activeChildForFeedback && (
        <ParentFeedbackModal
          isOpen={isParentFeedbackModalOpen}
          onClose={() => setIsParentFeedbackModalOpen(false)}
          parentUser={currentUser}
          childUser={activeChildForFeedback}
          onSaved={refreshAllData}
        />
      )}

      {isGuideModalOpen && (
        <PanduanIntegrasiModal
          isOpen={isGuideModalOpen}
          onClose={() => setIsGuideModalOpen(false)}
        />
      )}
    </div>
  );
}
