class ProjectsController < ApplicationController

  def show
    @project = Project.find(params[:id])
  end

  def project_instruments
    @project = Project.find(params[:id])
    @instruments = @project.instruments
  end

  def project_instruments_metrics
    @project = Project.find(params[:id])
    @instruments = @project.instruments
  end

  def project_equipment
    @project = Project.find(params[:id])
    @equipment = @project.equipment
  end

  def project_equipment_metrics
    @project = Project.find(params[:id])
    @equipment = @project.equipment
  end

  def project_rfis
    @project = Project.find(params[:id])
    @rfis = @project.information_requests
  end
end
