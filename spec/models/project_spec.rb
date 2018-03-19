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

  describe 'metrics_reporting' do
    before do
      @user = FactoryBot.create(:user)
      @project = FactoryBot.create(:project, user: @user)
      @project.project_start_date = "April 3, 2018".to_date
      @project.project_end_date = " May 10, 2018".to_date
    end

    it 'can generate an array of metrics reporting days' do
      expect(@project.reporting_days_array.length).to eq(6)
      expect(@project.reporting_days_array.sample.wday).to eq(4)
    end

    it 'calculates the number of metrics items added per reporting period' do
      inst1 = FactoryBot.create(:instrument, project: @project)
      inst2 = FactoryBot.create(:instrument, project: @project)
      inst3 = FactoryBot.create(:instrument, project: @project)
      inst4 = FactoryBot.create(:instrument, project: @project)
      inst5 = FactoryBot.create(:instrument, project: @project)
      inst6 = FactoryBot.create(:instrument, project: @project)
      inst7 = FactoryBot.create(:instrument, project: @project)
      inst8 = FactoryBot.create(:instrument, project: @project)
      inst9 = FactoryBot.create(:instrument, project: @project)
      inst10 = FactoryBot.create(:instrument, project: @project)
      inst1.datasheet_submitted_for_approval = 1
      inst1.datasheet_submitted_for_approval_completed_at = "April 5, 2018".to_date
      inst1.save
      inst2.datasheet_submitted_for_approval = 1
      inst2.datasheet_submitted_for_approval_completed_at = "April 5, 2018".to_date
      inst2.save
      inst3.datasheet_submitted_for_approval = 1
      inst3.datasheet_submitted_for_approval_completed_at = "April 12, 2018".to_date
      inst3.save
      inst4.datasheet_submitted_for_approval = 1
      inst4.datasheet_submitted_for_approval_completed_at = "April 12, 2018".to_date
      inst4.save
      inst5.datasheet_submitted_for_approval = 1
      inst5.datasheet_submitted_for_approval_completed_at = "April 12, 2018".to_date
      inst5.save
      inst6.datasheet_submitted_for_approval = 1
      inst6.datasheet_submitted_for_approval_completed_at = "April 12, 2018".to_date
      inst6.save
      inst7.datasheet_submitted_for_approval = 1
      inst7.datasheet_submitted_for_approval_completed_at = "April 19, 2018".to_date
      inst7.save
      inst8.datasheet_submitted_for_approval = 1
      inst8.datasheet_submitted_for_approval_completed_at = "April 19, 2018".to_date
      inst8.save
      inst9.datasheet_submitted_for_approval = 1
      inst9.datasheet_submitted_for_approval_completed_at = "April 26, 2018".to_date
      inst9.save
      inst10.datasheet_submitted_for_approval = 1
      inst10.datasheet_submitted_for_approval_completed_at = "May 3, 2018".to_date
      inst10.save

      expect(
        @project.instrument_metrics_report[:datasheet_submitted_for_approval][0]
      ).
        to eq(0)
        expect(@project.instrument_metrics_report[:datasheet_submitted_for_approval][1]).to eq(2)
      expect(@project.instrument_metrics_report[:datasheet_submitted_for_approval][2]).to eq(4)
      expect(@project.instrument_metrics_report[:datasheet_submitted_for_approval][3]).to eq(2)
      expect(@project.instrument_metrics_report[:datasheet_submitted_for_approval][4]).to eq(1)
      expect(@project.instrument_metrics_report[:datasheet_submitted_for_approval][5]).to eq(1)

    end
  end
end
