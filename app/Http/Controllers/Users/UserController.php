<?php

namespace App\Http\Controllers\Users;

use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

use App\Models\User;
use App\Http\Controllers\Controller;

class UserController extends Controller
{
    public function __construct()
    {
        if (! Auth::user()->is_super_admin) {
            abort(403, 'Unauthorized action.');
        }
    }

    public function index(): Response
    {
        $users = User::where('may_be_visible', true)->get();

        return Inertia::render('users/Index', [
            'users' => $users,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'is_active' => 'nullable|boolean',
        ]);

        $validated['uid'] = User::generateUID();
        $validated['password'] = Hash::make($validated['password']);

        User::create($validated);

        return back();
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $rules = [
            'name' => 'required|string|max:255',
            'email' => "required|email|unique:users,email,$user->id",
            'is_active' => 'nullable|boolean',
        ];

        // Only require password if it's provided
        if ($request->filled('password')) {
            $rules['password'] = 'required|string|min:8';
        }

        $validated = $request->validate($rules);

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'is_active' => $validated['is_active'],
        ];

        if ($request->filled('password')) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $user->update($updateData);

        return back();
    }

    public function destroy(User $user): RedirectResponse
    {
        $deleted = $user->delete();

        if (! $deleted) {
            throw ValidationException::withMessages([
                'orders' => 'No se puede eliminar una cuenta que tiene órdenes asociadas.',
            ]);
        }

        return back();
    }
}
