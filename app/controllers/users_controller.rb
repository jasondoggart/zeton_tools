class UsersController < Clearance::UsersController
  before_action :require_login

  def show
    @user = User.find(params[:id])
  end

  private

    def user_params
      params.require(:user).permit(:email, :password, :first_name, :last_name)
    end
end
