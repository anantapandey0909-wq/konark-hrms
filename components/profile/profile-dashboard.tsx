'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

import { useAuth } from '@/hooks/use-auth';
import { mockUserProfile } from '@/mock/profile';
import type { UserProfile } from '@/types/profile';

import ProfileHeader from './profile-header';
import PersonalInformationCard from './personal-information-card';
import AccountInformationCard from './account-information-card';
import SecurityCard from './security-card';
import PreferencesCard from './preferences-card';
import ActivityCard from './activity-card';
import EditProfileDialog from './edit-profile-dialog';

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const blockVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 15,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function ProfileDashboard() {
  const { user } = useAuth();

  /**
   * Only store fields edited by the user.
   * Auth data should always come from useAuth().
   */
  const [editableProfile, setEditableProfile] = useState<
    Partial<UserProfile>
  >({});

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const profile = useMemo<UserProfile>(
    () => ({
      ...mockUserProfile,

      // ==========================
      // Authentication (Source of Truth)
      // ==========================
      firstName: user?.firstName ?? mockUserProfile.firstName,
      lastName: user?.lastName ?? mockUserProfile.lastName,
      email: user?.email ?? mockUserProfile.email,
      role: user?.role ?? mockUserProfile.role,

      employeeId: user?.employeeId ?? mockUserProfile.employeeId,
      phone: user?.phone ?? mockUserProfile.phone,
      department: user?.department ?? mockUserProfile.department,
      designation: user?.designation ?? mockUserProfile.designation,
      company: user?.company ?? mockUserProfile.company,
      avatarUrl: user?.avatarUrl ?? mockUserProfile.avatarUrl,

      username:
        user?.email?.split('@')[0] ??
        mockUserProfile.username,

      // ==========================
      // Mock fields (until backend)
      // ==========================
      joiningDate: mockUserProfile.joiningDate,
      reportingManager: mockUserProfile.reportingManager,
      address: mockUserProfile.address,
      emergencyContact: mockUserProfile.emergencyContact,
      bloodGroup: mockUserProfile.bloodGroup,
      gender: mockUserProfile.gender,
      dateOfBirth: mockUserProfile.dateOfBirth,
      employmentType: mockUserProfile.employmentType,
      accountStatus: mockUserProfile.accountStatus,
      createdDate: mockUserProfile.createdDate,

      lastLogin:
        mockUserProfile.loginHistory[0]?.timestamp ??
        mockUserProfile.lastLogin,

      preferences: mockUserProfile.preferences,
      security: mockUserProfile.security,
      activities: mockUserProfile.activities,
      loginHistory: mockUserProfile.loginHistory,

      // User edits override displayed values
      ...editableProfile,
    }),
    [user, editableProfile]
  );

  const handleProfileUpdate = (
    updatedFields: Partial<UserProfile>
  ) => {
    setEditableProfile((prev) => ({
      ...prev,
      ...updatedFields,
    }));
  };

  return (
    <div className="container mx-auto space-y-6 px-4 py-8">
      <ProfileHeader
        profile={profile}
        onEditClick={() => setIsEditDialogOpen(true)}
      />

      <motion.div
        className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="space-y-6 lg:col-span-2">
          <motion.div variants={blockVariants}>
            <PersonalInformationCard profile={profile} />
          </motion.div>

          <motion.div variants={blockVariants}>
            <SecurityCard profile={profile} />
          </motion.div>

          <motion.div variants={blockVariants}>
            <PreferencesCard profile={profile} />
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div variants={blockVariants}>
            <AccountInformationCard profile={profile} />
          </motion.div>

          <motion.div variants={blockVariants}>
            <ActivityCard profile={profile} />
          </motion.div>
        </div>
      </motion.div>

      <EditProfileDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        profile={profile}
        onSave={handleProfileUpdate}
      />
    </div>
  );
}