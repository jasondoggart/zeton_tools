require 'rails_helper'

RSpec.describe Project, type: :model do
  describe 'creation' do
    before do
      @project = FactoryBot.create(:project)
      user = User.create(email: "newuser@example.com", password: "password")
      @project.user = user
    end

    it 'can be created with valid parameters' do
      expect(@project).to be_valid
    end

    it 'cannot be created without a project number' do
      @project.project_number = ''
      expect(@project).to_not be_valid
    end

    it 'cannot be created without a project name' do
      @project.project_name = ''
      expect(@project).to_not be_valid
    end

    it 'cannot be created without a user' do
      @project.user = nil
      expect(@project).to_not be_valid
    end

    it 'cannot be created without a client' do
      @project.client = ''
      expect(@project).to_not be_valid
    end

  end
end
