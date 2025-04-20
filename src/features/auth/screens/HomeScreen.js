import React from 'react';
import { View, Text, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

const HomeScreen = ({ navigation }) => {
    const handleNavigate = (route) => () => navigation.navigate(route);

    const HeaderSection = () => (
        <View className="items-center px-6 pt-6">
            {/* Línea superior */}
            <View className="absolute top-0 w-full">
                <LinearGradient
                    colors={['#006FB9', '#194B7B']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ height: 8, width: '100%', borderRadius: 4 }}
                />
            </View>

            <View className="items-center my-32">
                <Text className="text-h1 font-bold text-brand-afore mb-0">Bienvenido a</Text>
                <Image
                    source={require('../../../assets/Nexus2.png')}
                    style={{ width: 300, height: 160 }}
                    resizeMode="contain"
                />
            </View>

            <View className="w-full flex-row items-center mt-1">
                <View className="flex-1 h-px bg-border-neutral" />
                <View className="mx-4 w-3 h-3 bg-primary rounded-full" />
                <View className="flex-1 h-px bg-border-neutral" />
            </View>

            {/* Descripción */}
            <View className="w-full bg-brand-coppel rounded-md p-4 shadow-default mt-8">
                <Text className="text-body text-text text-center font-medium">
                    Conectando emprendedores con las herramientas que necesitan para crecer
                </Text>
            </View>

            {/* Decoraciones laterales */}
            <View className="absolute left-0 top-1/3 h-24 w-4">
                <LinearGradient
                    colors={['#FFDD35', '#FFB800']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={{ height: '100%', width: '100%', borderTopRightRadius: 4, borderBottomRightRadius: 4 }}
                />
            </View>
            <View className="absolute right-0 top-1/2 h-24 w-4">
                <LinearGradient
                    colors={['#006FB9', '#194B7B']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={{ height: '100%', width: '100%', borderTopLeftRadius: 4, borderBottomLeftRadius: 4 }}
                />
            </View>
        </View>
    );

    const FooterSection = () => (
        <View className="px-6 pt-6 pb-10 space-y-5 mt-48">
            <TouchableOpacity
                className="rounded-md overflow-hidden"
                onPress={handleNavigate('Login')}  // Changed to 'Login'
            >
                <LinearGradient
                    colors={['#006FB9', '#194B7B']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 2, y: 0 }}
                >
                    <View className="py-4">
                        <Text className="text-center font-semibold text-body text-white">
                            Iniciar Sesión
                        </Text>
                    </View>
                </LinearGradient>
            </TouchableOpacity>

            <Text className="text-center text-small text-text-soft mt-10">
                ¿Olvidaste tu contraseña?{' '}
                <Text className="text-primary font-medium">Recuperar</Text>
            </Text>

            <View className="w-full flex-row items-center justify-center mt-2">
                <View className="w-16 h-1">
                    <LinearGradient
                        colors={['#FFDD35', '#FFB800']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ height: '100%', width: '100%', borderRadius: 4 }}
                    />
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-background">
            <StatusBar style="dark" />
            <HeaderSection />
            <FooterSection />
        </SafeAreaView>
    );
};

export default HomeScreen;
