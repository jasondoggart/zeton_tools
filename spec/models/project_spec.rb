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

      equip1 = FactoryBot.create(:equipment, project: @project)
      equip2 = FactoryBot.create(:equipment, project: @project)
      equip3 = FactoryBot.create(:equipment, project: @project)
      equip4 = FactoryBot.create(:equipment, project: @project)
      equip5 = FactoryBot.create(:equipment, project: @project)
      equip6 = FactoryBot.create(:equipment, project: @project)
      equip7 = FactoryBot.create(:equipment, project: @project)
      equip8 = FactoryBot.create(:equipment, project: @project)
      equip9 = FactoryBot.create(:equipment, project: @project)
      equip10 = FactoryBot.create(:equipment, project: @project)

      hv1 = FactoryBot.create(:handvalve, project: @project)
      hv2 = FactoryBot.create(:handvalve, project: @project)
      hv3 = FactoryBot.create(:handvalve, project: @project)
      hv4 = FactoryBot.create(:handvalve, project: @project)
      hv5 = FactoryBot.create(:handvalve, project: @project)
      hv6 = FactoryBot.create(:handvalve, project: @project)
      hv7 = FactoryBot.create(:handvalve, project: @project)
      hv8 = FactoryBot.create(:handvalve, project: @project)
      hv9 = FactoryBot.create(:handvalve, project: @project)
      hv10 = FactoryBot.create(:handvalve, project: @project)

      inst1.datasheet_submitted_for_approval = 1
      inst1.datasheet_submitted_for_approval_completed_at = "April 5, 2018".
        to_date
      inst1.save
      inst2.datasheet_submitted_for_approval = 1
      inst2.datasheet_submitted_for_approval_completed_at = "April 5, 2018".
        to_date
      inst2.save
      inst3.datasheet_submitted_for_approval = 1
      inst3.datasheet_submitted_for_approval_completed_at = "April 12, 2018".
        to_date
      inst3.save
      inst4.datasheet_submitted_for_approval = 1
      inst4.datasheet_submitted_for_approval_completed_at = "April 12, 2018".
        to_date
      inst4.save
      inst5.datasheet_submitted_for_approval = 1
      inst5.datasheet_submitted_for_approval_completed_at = "April 12, 2018".
        to_date
      inst5.save
      inst6.datasheet_submitted_for_approval = 1
      inst6.datasheet_submitted_for_approval_completed_at = "April 12, 2018".
        to_date
      inst6.save
      inst7.datasheet_submitted_for_approval = 1
      inst7.datasheet_submitted_for_approval_completed_at = "April 19, 2018".
        to_date
      inst7.save
      inst8.datasheet_submitted_for_approval = 1
      inst8.datasheet_submitted_for_approval_completed_at = "April 19, 2018".
        to_date
      inst8.save
      inst9.datasheet_submitted_for_approval = 1
      inst9.datasheet_submitted_for_approval_completed_at = "April 26, 2018".
        to_date
      inst9.save
      inst10.datasheet_submitted_for_approval = 1
      inst10.datasheet_submitted_for_approval_completed_at = "May 3, 2018".
        to_date
      inst10.save

      equip1.datasheet_complete = 1
      equip1.datasheet_complete_completed_at = "April 5, 2018".
        to_date
      equip1.save

      equip2.datasheet_complete = 1
      equip2.datasheet_complete_completed_at = "April 5, 2018".
        to_date
      equip2.save

      equip3.datasheet_complete = 1
      equip3.datasheet_complete_completed_at = "April 12, 2018".
        to_date
      equip3.save

      equip4.datasheet_complete = 1
      equip4.datasheet_complete_completed_at = "April 12, 2018".
        to_date
      equip4.save

      equip5.datasheet_complete = 1
      equip5.datasheet_complete_completed_at = "April 12, 2018".
        to_date
      equip5.save

      equip6.datasheet_complete = 1
      equip6.datasheet_complete_completed_at = "April 12, 2018".
        to_date
      equip6.save

      equip7.datasheet_complete = 1
      equip7.datasheet_complete_completed_at = "April 19, 2018".
        to_date
      equip7.save

      equip8.datasheet_complete = 1
      equip8.datasheet_complete_completed_at = "April 19, 2018".
        to_date
      equip8.save

      equip9.datasheet_complete = 1
      equip9.datasheet_complete_completed_at = "April 26, 2018".
        to_date
      equip9.save

      equip10.datasheet_complete = 1
      equip10.datasheet_complete_completed_at = "May 3, 2018".
        to_date
      equip10.save

      hv1.valve_description_complete = 1
      hv1.valve_description_complete_completed_at = "April 5, 2018".
        to_date
      hv1.save

      hv2.valve_description_complete = 1
      hv2.valve_description_complete_completed_at = "April 5, 2018".
        to_date
      hv2.save

      hv3.valve_description_complete = 1
      hv3.valve_description_complete_completed_at = "April 12, 2018".
        to_date
      hv3.save

      hv4.valve_description_complete = 1
      hv4.valve_description_complete_completed_at = "April 12, 2018".
        to_date
      hv4.save

      hv5.valve_description_complete = 1
      hv5.valve_description_complete_completed_at = "April 12, 2018".
        to_date
      hv5.save

      hv6.valve_description_complete = 1
      hv6.valve_description_complete_completed_at = "April 12, 2018".
        to_date
      hv6.save

      hv7.valve_description_complete = 1
      hv7.valve_description_complete_completed_at = "April 19, 2018".
        to_date
      hv7.save

      hv8.valve_description_complete = 1
      hv8.valve_description_complete_completed_at = "April 19, 2018".
        to_date
      hv8.save

      hv9.valve_description_complete = 1
      hv9.valve_description_complete_completed_at = "April 26, 2018".
        to_date
      hv9.save

      hv10.valve_description_complete = 1
      hv10.valve_description_complete_completed_at = "May 3, 2018".
        to_date
      hv10.save

      expect(@project.metrics_report_for(Instrument)[:datasheet_submitted_for_approval][0]).
        to eq(0)
      expect(@project.metrics_report_for(Instrument)[:datasheet_submitted_for_approval][1]).
        to eq(2)
      expect(@project.metrics_report_for(Instrument)[:datasheet_submitted_for_approval][2]).
        to eq(4)
      expect(@project.metrics_report_for(Instrument)[:datasheet_submitted_for_approval][3]).
        to eq(2)
      expect(@project.metrics_report_for(Instrument)[:datasheet_submitted_for_approval][4]).
        to eq(1)
      expect(@project.metrics_report_for(Instrument)[:datasheet_submitted_for_approval][5]).
        to eq(1)

      expect(@project.cumulative_metrics_report_for(Instrument)[:datasheet_submitted_for_approval][0]).
        to eq(0)
      expect(@project.cumulative_metrics_report_for(Instrument)[:datasheet_submitted_for_approval][1]).
        to eq(2)
      expect(@project.cumulative_metrics_report_for(Instrument)[:datasheet_submitted_for_approval][2]).
        to eq(6)
      expect(@project.cumulative_metrics_report_for(Instrument)[:datasheet_submitted_for_approval][3]).
        to eq(8)
      expect(@project.cumulative_metrics_report_for(Instrument)[:datasheet_submitted_for_approval][4]).
        to eq(9)
      expect(@project.cumulative_metrics_report_for(Instrument)[:datasheet_submitted_for_approval][5]).
        to eq(10)

      expect(@project.metrics_report_for(Equipment)[:datasheet_complete][0]).
        to eq(0)
      expect(@project.metrics_report_for(Equipment)[:datasheet_complete][1]).
        to eq(2)
      expect(@project.metrics_report_for(Equipment)[:datasheet_complete][2]).
        to eq(4)
      expect(@project.metrics_report_for(Equipment)[:datasheet_complete][3]).
        to eq(2)
      expect(@project.metrics_report_for(Equipment)[:datasheet_complete][4]).
        to eq(1)
      expect(@project.metrics_report_for(Equipment)[:datasheet_complete][5]).
        to eq(1)

      expect(@project.cumulative_metrics_report_for(Equipment)[:datasheet_complete][0]).
        to eq(0)
      expect(@project.cumulative_metrics_report_for(Equipment)[:datasheet_complete][1]).
        to eq(2)
      expect(@project.cumulative_metrics_report_for(Equipment)[:datasheet_complete][2]).
        to eq(6)
      expect(@project.cumulative_metrics_report_for(Equipment)[:datasheet_complete][3]).
        to eq(8)
      expect(@project.cumulative_metrics_report_for(Equipment)[:datasheet_complete][4]).
        to eq(9)
      expect(@project.cumulative_metrics_report_for(Equipment)[:datasheet_complete][5]).
        to eq(10)

      expect(@project.metrics_report_for(Handvalve)[:valve_description_complete][0]).
        to eq(0)
      expect(@project.metrics_report_for(Handvalve)[:valve_description_complete][1]).
        to eq(2)
      expect(@project.metrics_report_for(Handvalve)[:valve_description_complete][2]).
        to eq(4)
      expect(@project.metrics_report_for(Handvalve)[:valve_description_complete][3]).
        to eq(2)
      expect(@project.metrics_report_for(Handvalve)[:valve_description_complete][4]).
        to eq(1)
      expect(@project.metrics_report_for(Handvalve)[:valve_description_complete][5]).
        to eq(1)

      expect(@project.cumulative_metrics_report_for(Handvalve)[:valve_description_complete][0]).
        to eq(0)
      expect(@project.cumulative_metrics_report_for(Handvalve)[:valve_description_complete][1]).
        to eq(2)
      expect(@project.cumulative_metrics_report_for(Handvalve)[:valve_description_complete][2]).
        to eq(6)
      expect(@project.cumulative_metrics_report_for(Handvalve)[:valve_description_complete][3]).
        to eq(8)
      expect(@project.cumulative_metrics_report_for(Handvalve)[:valve_description_complete][4]).
        to eq(9)
      expect(@project.cumulative_metrics_report_for(Handvalve)[:valve_description_complete][5]).
        to eq(10)

    end
  end
end
