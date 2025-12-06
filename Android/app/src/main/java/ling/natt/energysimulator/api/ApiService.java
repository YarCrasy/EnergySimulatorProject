package ling.natt.energysimulator.api;

import ling.natt.energysimulator.models.User;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.POST;

public interface ApiService {
    @POST("api/users/login")
    Call<User> login(@Body LoginRequest request);

}
