class TeamMembersController < ApplicationController
  before_action require_login

  def new
    @users = User.all
    @team_member = TeamMember.new
  end

  def create
    @team_member = current_project.team_members.build(team_member_params)
    if @team_member.save
      flash[:success] = "Team member added"
      redirect_to project_path(@team_member.project)
    else
      flash[:danger]
      redirect_to new_team_member_path(:project => @team_member.project)
    end
  end

  def destroy
    @team_member = TeamMember.find(params[:id])
    @team_member.destroy
    flash[:info] = "Team member was removed"
    redirect_to project_path(current_project)
  end

  private

  def team_member_params
    params.require(:team_member).permit(:project_id, :user_id)
  end
end
