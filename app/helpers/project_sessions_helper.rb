module ProjectSessionsHelper

  def set_current_project(project)
    session[:project_id] = project.id
  end

  def clear_current_project
    session[:project_id] = nil
  end

  def current_project
    @current_project ||= Project.find_by(id: session[:project_id])
  end

  def must_select_project
    if !current_project
      flash[:warning] = "Please select a project"
      redirect_to root_path
    end
  end
end
