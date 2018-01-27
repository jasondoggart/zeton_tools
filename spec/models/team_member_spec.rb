require 'rails_helper'

RSpec.describe TeamMember, type: :model do
  describe 'creation' do
    before do
      @team_member = FactoryBot.create(:team_member)
    end

    it 'can be created with valid parameters' do
      expect(@team_member).to be_valid
    end

    it 'cannot be created without a user' do
      @team_member.user = nil
      expect(@team_member).to_not be_valid
    end

    it 'cannot be created without a project' do
      @team_member.project = nil
      expect(@team_member).to_not be_valid
    end

    it 'can create multiple team members for the same project' do
      user1 = FactoryBot.create(:user)
      user2 = FactoryBot.create(:user)
      user3 = FactoryBot.create(:user)
      project = FactoryBot.create(:project)
      before_count = project.team_members.count
      team_member1 = TeamMember.create(user: user1, project: project)
      team_member2 = TeamMember.create(user: user2, project: project)
      team_member3 = TeamMember.create(user: user3, project: project)
      expect(project.team_members.count).to eq(before_count + 3)
    end

    it 'can create multiple team memberships for one user' do
      user = FactoryBot.create(:user)
      project1 = FactoryBot.create(:project)
      project2 = FactoryBot.create(:project)
      project3 = FactoryBot.create(:project)
      before_count = user.team_memberships.count
      team_member1 = TeamMember.create(user: user, project: project1)
      team_member2 = TeamMember.create(user: user, project: project2)
      team_member3 = TeamMember.create(user: user, project: project3)
      expect(user.team_memberships.count).to eq(before_count + 3)
    end
  end
end
