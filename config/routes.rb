Rails.application.routes.draw do
  resources :rfi_tables
  resources :instruments
  resources :equipment
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
