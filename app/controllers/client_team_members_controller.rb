class ClientTeamMembersController < ApplicationController
  def new
    @client_team_member = ClientTeamMember.new
  end

  def create
    @client_team_member = current_project.client_team_members.build(
      client_team_member_params
    )
    if @client_team_member.save
      flash[:success] = "Successfuly created new client team member"
      redirect_to project_path(current_project)
    else
      flash[:danger] = "Could not add client team member"
      render :new
    end
  end

  def destroy
    @client_team_member = ClientTeamMember.find(params[:id])
    @client_team_member.delete
    flash[:info] = "Client team member removed"
    redirect_to project_path(current_project)
  end
  private

  def client_team_member_params
    params.require(:client_team_member).permit(
      :first_name,
      :last_name,
      :email,
      :organization,
      :role
    )
  end
end
